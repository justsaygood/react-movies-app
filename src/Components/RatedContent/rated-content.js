import React from 'react'
import { Pagination, Spin, Alert } from 'antd'
import { debounce } from 'lodash'

import MovieList from '../MovieList/movie-list'
import ApiService from '../../api-service'

export default class RatedContent extends React.Component {
  state = {
    loading: false,
    movies: [],
    error: null,
    paginationValue: localStorage.getItem('ratedPageData')
      ? JSON.parse(localStorage.getItem('ratedPageData')).paginationValue
      : 1,
    allMovies: 0,
  }

  componentDidMount() {
    const { paginationValue } = this.state
    this.onLoading()
    this.getMovies(paginationValue)
  }

  componentDidUpdate(prevProps, prevState) {
    const { paginationValue } = this.state
    if (paginationValue !== prevState.paginationValue) {
      this.onLoading()
      this.getMovies(paginationValue)
    }
  }

  onPaginationChange = (paginationValue) => this.setState({ paginationValue })

  getMovies = debounce((page) => {
    ApiService.getRatedMovies(page)
      .then((body) => {
        this.setState({ movies: body.results, loading: false, allMovies: body.total_results })
        this.saveState()
      })
      .catch((error) => {
        this.setState({
          error,
          loading: false,
        })
      })
  }, 800)

  onLoading = () => {
    this.setState({
      loading: true,
      error: null,
      movies: [],
      allMovies: 0,
    })
  }

  saveState = () => {
    const { paginationValue } = this.state
    let state = {
      paginationValue,
    }
    state = JSON.stringify(state)
    localStorage.setItem('ratedPageData', state)
  }

  render() {
    const { movies, error, loading, paginationValue, allMovies } = this.state

    return (
      <section className="app__content">
        {loading ? <Spin className="spinner" size="large" /> : null}
        {error ? <Alert message={error.message} type="error" showIcon /> : null}
        <MovieList movies={movies} loading={loading} error={error} />
        <Pagination
          className="app__pagination"
          showSizeChanger={false}
          current={paginationValue}
          total={allMovies}
          onChange={this.onPaginationChange}
        />
      </section>
    )
  }
}
