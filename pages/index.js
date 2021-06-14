import React, { useState } from 'react'
import styles from '../styles/Home.module.css'
import moment from 'moment'
import Head from 'next/head'
import YouTube from 'react-youtube';

export default function Home() {
	const [form, setForm ] = useState({
		search:''
	})
	const [ load, setLoad ] = useState(false)
	const [ result, setResult ] = useState({})
	const [ page, setPage ] = useState(1)
	const [ detail, setDetail ] = useState(false)
	const [ position, setPosition ] = useState(0)
	const onChange = evt => {
		const value = evt.target.value
		const key = evt.target.name
		setForm(old => ({
		  ...old,
		  [key]: value
		}))
	}
	const search = async(evt) => {		
		try {
			if(evt.key === 'Enter'){
				setPage(1)
				setPosition(0)
				setDetail(false)
				setLoad(true)
				setResult({})
				const response = await fetch(`/api/search-movie?movie=${form.search}`)
				const data = await response.json()		  
				setResult(data.movies)
				setLoad(false)
			}
		} catch (err) {
		}
	}

	const card = (movies) => {
		const list = movies.map((movie) =>			
			<div key={movie.id} className={styles.row}>	
				<div className={styles.col_2}>			
					<img className={styles.col_12} src={`https://image.tmdb.org/t/p/w500`+movie.poster_path} />		
				</div>	

				<div className={styles.col_10}>
					<div className={styles.title}>{movie.original_title}</div>
					<div className={styles.date}>{ moment(movie.release_date).format('DD/MM/YYYY')}</div>			
					<div className={styles.description}>{movie.overview}</div>			
					<div className={styles.genre}>{movie.details.genres.map(el => <div className={styles.item_genre}>  {el.name} </div>)}</div>								
				</div>
				<div className={styles.detail}>
					<div id={result.indexOf(movie)} className={styles.detail_button} onClick={openDetails}>Detalhes</div>
				</div>
			</div>	
		)
		return (<>{list}</>)
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
			list.push(<div className={ i == page ? styles.item_page_selected: styles.item_page } key={i} onClick={changePage}>{i}</div>)					
		}		
		return (<div className={styles.item}>{list}</div>)
	}
	const _onReady = (event) => {
		// access to player in all event handlers via event.target
		event.target.pauseVideo();
	  }

	const video = (id) => {
		const opts = {
			playerVars: {
			  autoplay: 1,
			},
		  };
		  return (
		  	<div className={styles.boxVideo}>
		  		<YouTube className={styles.player} videoId={id} opts={opts} onReady={_onReady} />
			</div>
		  )
	}

	const modalDetails = () => {
		return(
			<section>
				<div className={styles.row}>
					<div className={styles.col_3_r}>
						<div className={styles.date_r}>{moment(result[position].details.release_date).format('DD/MM/YYYY')}</div>
						<img className={styles.col_12} src={`https://image.tmdb.org/t/p/w500`+result[position].poster_path} />
					</div>
					<div className={styles.col_9_r}>
						<div className={styles.back}>
							<div className={styles.back_button} onClick={closeDetails}>Voltar</div>
						</div>
						<div className={styles.title_r}><h3>{result[position].details.original_title}</h3></div>
						<div className={styles.description}>
							<span className={styles.sub_title}>Sinopse</span>
							<hr className={styles.separator}/>
							{result[position].details.overview}
						</div>
			
						<div className={styles.description}> 
							<span className={styles.sub_title}>Informações</span>
							<hr className={styles.separator}/>
							<div className={styles.item_info}>
								<p>Situação</p>
								<p className={styles.item_info_value}>Lançado</p>
							</div>
							<div className={styles.item_info}>
								<p>Idioma</p>
								<p className={styles.item_info_value}>{result[position].details.spoken_languages.length > 0 &&result[position].details.spoken_languages[0].name}</p>
							</div>
							<div className={styles.item_info}>
								<p>Duração</p>
								<p className={styles.item_info_value}>{moment.utc().startOf('day').add(result[position].details.runtime, 'minutes').format('hh:mm')}</p>
							</div>
							<div className={styles.item_info}>
								<p>Orçamento</p>
								<p className={styles.item_info_value}>{result[position].details.budget.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</p>
							</div>
							<div className={styles.item_info}>
								<p>Receita</p>
								<p className={styles.item_info_value}>{result[position].details.revenue.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</p>
							</div>
							<div className={styles.item_info}>
								<p>Lucro</p>
								<p className={styles.item_info_value}>{(result[position].details.revenue - result[position].details.budget).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</p>
							</div>						
						</div>
						<div className={styles.genre}>{result[position].details.genres.map(el => <div className={styles.item_genre}>  {el.name} </div>)}</div>												  

					</div>
				</div>
				{result[position].videos.results.length > 0 && video(result[position].videos.results[0].key)}						
			</section>
		)
	}

	const openDetails = evt => {
		setPosition(evt.target.id)
		setDetail(true)		
	}

	const closeDetails = evt => {
		setDetail(false)
	}
	return (
		<React.Fragment>
			<Head>
				<title>The - Movies</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
			</Head>
			<div className={styles.container}>
				<div className={styles.header}>	
					Movies			
				</div>
				{!detail && 
					<div className={styles.search}>		
						<input  className={styles.input_search} type='text' placeholder='Pesquisar pelo nome do filme' onChange={onChange} name='search' value={form.search} onKeyPress={search}/>
					</div>
				}
				{ load && <p> Carregando... </p>}
				<div>
					{ result.length && !detail > 0 && pagination()}
					{ result.length > 0 && !detail && buttonPage()}
					{ detail && modalDetails()}					
				</div>

				
			</div>
		</React.Fragment>
	);
}
