import React from 'react'
import { Input, Pagination } from 'antd'

import MovieList from '../MovieList/movie-list'
import ApiService from '../../api-service'

export default class SearchContent extends React.Component {
  state = {
    loading: false,
    movies: null,
    error: null,
    offline: false,
    page: 0,
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
    const { movies, error, loading, offline, page } = this.state
    return (
      <section className="app__content">
        <Input className="app__search" type="text" placeholder="Type to search ..." />
        <MovieList movies={movies} loading={loading} error={error} offline={offline} />
        <Pagination className="app__pagination" size="small" page={page} />
      </section>
    )
  }
}
