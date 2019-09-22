import React, { useEffect } from 'react'
import { from, of, timer, fromEvent, merge } from "rxjs"
import { useState } from "react"
import Axios from "axios"
import { switchMap, tap, takeUntil, mapTo, filter, finalize, mergeMap } from "rxjs/operators"
import styled from 'styled-components'

const Layout = styled.div`
    flex: 1;
`

const CATS_URL = 'https://placekitten.com/g'
const MEATS_URL = 'https://baconipsum.com/api/?type=meat-and-filler'

function mapCats(response) {
    return from(new Promise(resolve => {
        let blob = new Blob([response], { type: 'image/png' })
        let reader = new FileReader()

        reader.onload = data => resolve(data.target.result)
        reader.readAsDataURL(blob)
    }))
}

function mapMeats(response) {
    console.debug(response)
    const data = response

    return of(data ? data[0] : '')
}

function HttpPolling() {
    const [category, setCategory] = useState('cats')
    const [result, setResult] = useState(null)

    useEffect(() => {
        function requestData(url, mapFunc) {
            console.debug('URL: ', url)
        
            return from(new Promise(async resolve => {
                const w = Math.round(Math.random() * 400)
                const h = Math.round(Math.random() * 400)
        
                const targetUrl = category === 'cats' ? `${url}/${w}/${h}` : url
                const options = category === 'cats' && { responseType: 'arraybuffer' }
        
                const response = await Axios.get(targetUrl, options)
                resolve(response.data)
            }))
            .pipe(
                switchMap(mapFunc),
                tap(data => console.debug('Request Result: ', data))
            )
        }
    
        function startPolling(category, interval = 5000) {
            const url = category === 'cats' ? CATS_URL : MEATS_URL
            const mapper = category === 'cats' ? mapCats : mapMeats
    
            return timer(0, interval).pipe(
                switchMap(_ => requestData(url, mapper))
            )
        }
    
        const catsClick$ = fromEvent(document.getElementById('catsButton'), 'click').pipe(mapTo('cats'))
        const meatsClick$ = fromEvent(document.getElementById('meatsButton'), 'click').pipe(mapTo('meats'))
        const stopPolling$ = fromEvent(document.getElementById('stop'), 'click')
    
        function updateResult(result) {
            setResult(result)
        }
    
        function watchForData(category) {
            console.debug('Started Watching. Category:', category)
            return startPolling(category, 5000).pipe(
                tap(updateResult),
                takeUntil(
                    merge(
                        stopPolling$,
                        merge(catsClick$, meatsClick$).pipe(
                            filter(c => c !== category),
                            tap(c => console.debug('Setting category:', c))
                        )
                    )
                ),
                finalize(() => console.debug('Stooped!'))
            )
        }

        catsClick$.subscribe(c => {
            setCategory(c)
            setResult(null)
        })
        meatsClick$.subscribe(c => {
            setCategory(c)
            setResult(null)
        })

        const watching$ = fromEvent(document.getElementById('start'), 'click').pipe(
            tap(_ => console.debug('Started!')),
            mergeMap(_ => watchForData(category))
        )
        .subscribe()

        return () => watching$.unsubscribe()
    }, [category])

    console.debug(category, result)

    return (
        <Layout>
            <div>
                <button id='start'>Start</button>
                <button id='stop'>Stop</button>
                <button id='catsButton'>Cats</button>
                <button id='meatsButton'>Meats</button>
            </div>
            {category === 'cats' && result && (
                <div>
                    <img src={result} />
                </div>
            )}
            {category === 'meats' && (
                <div>{result}</div>
            )}
        </Layout>
    )
}

export default React.memo(HttpPolling)
