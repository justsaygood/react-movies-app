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
    searchValue: localStorage.getItem('searchPageData')
      ? JSON.parse(localStorage.getItem('searchPageData')).searchValue
      : '',
    allMovies: null,
    paginationValue: localStorage.getItem('searchPageData')
      ? JSON.parse(localStorage.getItem('searchPageData')).paginationValue
      : 1,
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
            allMovies: body.total_results,
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

  onSearchChange = (event) => {
    this.setState({ searchValue: event.target.value, loading: true, error: false })
  }

  onPaginationChange = (paginationValue) => this.setState({ paginationValue })

  render() {
    const { movies, error, loading, offline, page, allMovies, searchValue, paginationValue } = this.state
    return (
      <section className="app__content">
        <Input
          className="app__search"
          type="text"
          placeholder="Type to search ..."
          value={searchValue}
          onChange={this.onSearchChange}
        />
        <MovieList movies={movies} loading={loading} error={error} offline={offline} />
        <Pagination
          className="app__pagination"
          size="small"
          showSizeChanger={false}
          page={page}
          current={paginationValue}
          total={allMovies}
          onChange={this.onPaginationChange}
        />
      </section>
    )
  }
}
