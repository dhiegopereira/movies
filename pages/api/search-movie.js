
import axios from 'axios'

export default async(req, res) => {
    const result = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=155c18ad63799bb7e6d08f86dd591fa1&language=pt-BR&query=${req.query.movie}`)
    const movies = []
    let details = ''
    let videos = ''

    const asyncFunction = async (item, cb) => {      
        details = await axios.get(`https://api.themoviedb.org/3/movie/${item.id}?api_key=155c18ad63799bb7e6d08f86dd591fa1&language=pt-BR`)  
        item.details = details.data
        videos = await axios.get(`https://api.themoviedb.org/3/movie/${item.id}/videos?api_key=155c18ad63799bb7e6d08f86dd591fa1&language=pt-BR`)   
        item.videos = videos.data
        movies.push(item)
        cb()
    }

    let requests = await result.data.results.map(async item => {
        return new Promise((resolve) => {
          asyncFunction(item, resolve)
        });
    })
    
    Promise.all(requests).then(() => res.end(JSON.stringify({movies})));
}
