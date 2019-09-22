import React, { useState, useEffect } from 'react'
import { fromEvent, interval, merge, Subject } from "rxjs"
import { map, tap, mergeMap } from 'rxjs/operators'
import styled from 'styled-components'

const Layout = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
`

const Element = styled.div`
    position: absolute;
    height: 30px;
    width: 30px;
    text-align: center;
    top: ${props => props.y}px;
    left: ${props => props.x}px;
    background: silver;
    border-radius: 80%;
`

const subject = new Subject()

function Rx () {
    const [elementler, setElementler] = useState([])

    useEffect(() => {
        const $click = fromEvent(document, 'click').pipe(
            map(event => ({
                x: event.clientX,
                y: event.clientY,
                id: Math.random()
            })),
            tap(coords => setElementler(elementler => [...elementler, coords])),
            mergeMap(coords => subject.pipe(tap(v => console.debug(coords.id, v))))
        )

        const $interval = interval(1000).pipe(
            tap(v => subject.next(v)),
            tap(v => console.debug('Interval Value: ', v))
        )
        
        merge($click, $interval).subscribe()
    }, [])

    return (
        <Layout>
            {elementler.map(element => (
                <Element key={element.id} x={element.x} y={element.y} />
            ))}
        </Layout>
    )
}

export default React.memo(Rx)