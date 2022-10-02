import { fetchImage } from "../utils/fetchImage";
import { useState, useEffect } from "react";
import { SearchBar } from "./SearchBar/SearchBar";
import { ImageGallery } from "./ImageGallery/ImageGallery";
import { Button } from "./Button/Button";
import { Modal } from "./Modal/Modal";
import { ColorRing } from "react-loader-spinner";
import { AppEl } from "./App.styled";
import { Notify } from 'notiflix';

const API_KEY = '29165116-db33726688e81f885d73ac474';
const imagePerPage = 12;
let urlIm = '';

export function App() {
  const [name, setName] = useState('')
  const [collection, setCollection] = useState([])
  const [page, setPage] = useState(1)
  const [visible, setVisible] = useState(false)
  const [button, setButton] = useState(false)
  const [modal, setModal] = useState(false)

  useEffect(() => {
    if (name === '') {
      return
    }
    setVisible(true)
    const data = fetchImage(name, page, API_KEY)
    data.then(res => {
      if (res.hits.length === 0) {
        Notify.failure('Oooops, nothing found :(');
        setVisible(false)
        return
      }
      setCollection(prev => [...prev, ...res.hits])
      setVisible(false)
      setButton(res.totalHits / imagePerPage >= page ? true : false,)
    })
  }, [name, page])

  const onSubmit = (e) => {
    e.preventDefault();
    let valueInput = e.currentTarget.elements[1].value;

    if (name !== valueInput) {
      setName(valueInput)
      setCollection([])
      setPage(1)
    } else {
      Notify.failure("This query is the same.")
    }
  }

  const onLoadPades = () => {
    setPage(prev => prev + 1)
    setVisible(true)
  }

  const openModal = (url) => {
    window.addEventListener('click', closeModalWindow)
    window.addEventListener('keydown', closeModalWindow)
    setModal(true)
    return urlIm = url
  }

  const closeModalWindow = (e) => {
    if (e.target === e.currentTarget || e.code === 'Escape') {
      setModal(false)
      window.removeEventListener('click', closeModalWindow)
      window.removeEventListener('keydown', closeModalWindow)
    }
  }

  return (
    <AppEl>
      <SearchBar onSubmit={onSubmit}></SearchBar>
      <ImageGallery collection={collection} modal={openModal}></ImageGallery>
      {visible && <ColorRing
        height="80"
        width="80"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
      />}
      {button && <Button nextPage={onLoadPades}></Button>}
      {modal && <Modal data={urlIm} closeModal={closeModalWindow}></Modal>}
    </AppEl>
  )
}













