import React, { useState, useEffect, useMemo } from 'react';
import logo from './logo.svg';
import './App.css';
import Axios from 'axios';
import styled from "styled-components";
import moment from 'moment';
import 'moment/locale/tr'
import HttpPolling from './HttpPolling';

moment.locale('tr')

const Wrapper = styled.div`
  width: 100%;
  flex: 1;
  display: none;
`

const Layout = styled.div`
  display: flex;
  text-align: initial;
  font-size: initial;
  padding: 24px;
`
const Part = styled.div`
  flex: 1;
  margin-right: 192px;

  &:last-child {
    margin: 0;
  }
`

const ProsedurItem = styled.div`
  display: flex;
  margin-bottom: 12px;
`

const ProsedurAdi = styled.div`
  flex: 1;
`

function App() {
  const [prosedurler, setProsedurler] = useState([])
  const [islemler, setIslemler] = useState({})

  useEffect(() => {
    const prosedurleriGetir = async () => {
      const sonuc = await Axios.get('/api/prosedurler')
      setProsedurler(sonuc.data)
      setIslemler(await sonuc.data.reduce(async (_islemler, p) => {
        const sonuc = await Axios.get(`/api/prosedurler/${p.id}/islemler`)
        const oncekiIslemler = await _islemler

        return {
          ...oncekiIslemler,
          [p.id]: sonuc.data
        }
      }, {}))
    }

    prosedurleriGetir()
  }, [])

  const prosedurCalistir = async prosedur => {
    await Axios.post(`/api/prosedurler/${prosedur.id}/calistir`)
    const _islemler = await Axios.get(`/api/prosedurler/${prosedur.id}/islemler`)
    setIslemler(state => ({
      ...state,
      [prosedur.id]: _islemler.data
    }))
  }

  const prosedurListesi = useMemo(() => {
    const handleCalistir = prosedur => () => {
      console.debug(prosedur)
      prosedurCalistir(prosedur)
    }

    return prosedurler.map(prosedur => (
      <ProsedurItem key={prosedur.id}>
        <ProsedurAdi>{prosedur.adi}</ProsedurAdi>
        <div><button onClick={handleCalistir(prosedur)}>Çalıştır</button></div>
      </ProsedurItem>
    ))
  }, [prosedurler])

  const islemListesi = useMemo(() => {
    return Object.keys(islemler).map(prosedurId => {
      const prosedur = prosedurler.find(prosedur => prosedur.id === Number(prosedurId))

      return prosedur && (
        <div key={prosedurId}>
          <h4>{prosedur.adi}:</h4>
          <div>
            {islemler[prosedurId].map(islem => (
              <div key={islem.id}>{moment(islem.baslama).fromNow()} / {islem.bitis ? moment(islem.bitis).fromNow(): 'yok'}</div>
            ))}
          </div>
        </div>
      )})
  }, [islemler, prosedurler])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <HttpPolling />
        <Wrapper>
          <Layout>
            <Part>
              <h3>Prosedurler</h3>
              <div>
                {prosedurListesi}
              </div>
            </Part>
            <Part>
              <h3>İşlemler</h3>
              <div>
                {islemListesi}
              </div>
            </Part>
          </Layout>
        </Wrapper>
      </header>
    </div>
  );
}

export default App;
