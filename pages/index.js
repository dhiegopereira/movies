import React, { useState } from 'react'
import styles from '../styles/Home.module.css'
import moment from 'moment'

export default function Home() {
	const [form, setForm ] = useState({
		search:''
	})
	const [ load, setLoad ] = useState(false)
	const [ result, setResult ] = useState({})
	const [ page, setPage ] = useState(1)
	const [ detail, setDetail ] = useState(false)
	const onChange = evt => {
		const value = evt.target.value
		const key = evt.target.name
		setForm(old => ({
		  ...old,
		  [key]: value
		}))
	}
	const search = async() => {		
		try {
	      setLoad(true)
		  setResult({})
		  const response = await fetch(`/api/search-movie?movie=${form.search}`)
		  const data = await response.json()		  
		  setResult(data.movies)
		  setLoad(false)
		} catch (err) {
		}
	}

	const card = (movies) => {
		const list = movies.map((movie) =>			
			<div key={movie.id} className={styles.item}>	
				<div className={styles.aside_left}>			
					<img src={`https://image.tmdb.org/t/p/w500`+movie.poster_path} width="100%"  />		
				</div>	

				<div className={styles.aside_right}>
					<div className={styles.title_bkg}><div className={styles.title}>{movie.original_title}</div></div>
					<div className={styles.date}>{ moment(movie.release_date).format('DD/MM/YYYY')}</div>			
					<div className={styles.description}>{movie.overview}</div>			
					<div className={styles.genre}>{movie.details.genres.map(el => <div className={styles.item_genre}>  {el.name} </div>)}</div>								
				</div>
			</div>
		)
		return (<section>{list}</section>)
	}

	const pagination = () => {
		console.log(page)
		const numberOfItems = result.length;
		const itemsPerPage = 3;
		const tmp = []
		for (let i = (page - 1) * itemsPerPage; i < page *itemsPerPage && i < numberOfItems; i++){
			tmp.push(result[i])
		}
		return card(tmp)
	}

	const changePage = evt => {		
		setPage(evt.target.textContent)
	}

	const buttonPage = () => {
		const size = result.length/3
		const list = []
		for(let i = 1; i <= size; i++) {
			list.push(<div className={styles.button_page} key={i} onClick={changePage}>{i}</div>)			
		}		
		return (<div className={styles.pagination}>{list}</div>)
	}

	const openDetails = evt => {
		console.log(evt)
		setDetail(true)
	}

	const closeDetails = evt => {
		setDetail(false)
	}

	

	return (
		<div className={styles.col_12, styles.container}>
			<div className={styles.header}>	
				Movies			
       		</div>
			<div className={styles.search}>		
       		 	<input className={styles.input_search} type='text' placeholder='Pesquisar pelo nome do filme' onChange={onChange} name='search' value={form.search} onKeyPress={search}/>
			</div>
			{ load && <img src='./public/img/loading.gif' />}
			<div>
			{ result.length > 0 && pagination()}
			{ result.length > 0 && buttonPage()}
			{ detail &&
				<div>
					<div>Titulo</div>
					<div>Sinopse</div>
					<div><img src="" /></div>
					<div>Informações</div>
					<div>Generos</div>
					<div>Vídeo</div>
					<button onClick={closeDetails}>Fechar</button>
				</div>
			}
			
			</div>
		</div>
	);
}
