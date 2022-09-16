import React from 'react'

import MovieList from '../MovieList/movie-list'
import ApiService from '../../api-service'

import './app.css'

export default class App extends React.Component {
  state = {
    movies: null,
    loading: true,
    error: null,
    offline: false,
  }

  componentDidMount() {
    window.addEventListener('offline', () => {
      this.setState({ offline: true })
    })
    setTimeout(() => {
      ApiService.getMovies()
        .then((body) => {
          console.log(body)
          this.setState({
            movies: body.results,
            loading: false,
          })
        })
        .catch((error) => {
          this.setState({
            error,
            loading: false,
          })
        })
    }, 1000)
  }

  render() {
    const { movies, loading, error, offline } = this.state
    return <MovieList movies={movies} loading={loading} error={error} offline={offline} />
  }
}
