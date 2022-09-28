import React from 'react'
import { Input, Pagination } from 'antd'
import { debounce } from 'lodash'

import MovieList from '../MovieList/movie-list'
import ApiService from '../../api-service'

export default class SearchContent extends React.Component {
  state = {
    loading: false,
    movies: [],
    error: null,
    searchValue: localStorage.getItem('searchPageData')
      ? JSON.parse(localStorage.getItem('searchPageData')).searchValue
      : '',
    allMovies: null,
    paginationValue: localStorage.getItem('searchPageData')
      ? JSON.parse(localStorage.getItem('searchPageData')).paginationValue
      : 1,
  }

  componentDidMount() {
    const { searchValue, paginationValue } = this.state
    if (searchValue) {
      this.onLoading()
      this.getMovies(searchValue, paginationValue)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { searchValue, paginationValue } = this.state
    if (searchValue !== prevState.searchValue || paginationValue !== prevState.paginationValue) {
      if (!searchValue) {
        this.stopLoading()
        this.getMovies.cancel()
        return
      }
      this.onLoading()
      this.getMovies(searchValue, paginationValue)
    }
  }

  getMovies = debounce((searchValue, page) => {
    ApiService.getMovies(searchValue, page)
      .then((body) => {
        this.setState({
          movies: body.results,
          allMovies: body.total_results,
          loading: false,
        })
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

  stopLoading = () => {
    this.setState({
      loading: false,
      movies: [],
      allMovies: 0,
      error: null,
    })
  }

  saveState = () => {
    const { paginationValue, searchValue } = this.state
    let state = {
      paginationValue,
      searchValue,
    }
    state = JSON.stringify(state)
    localStorage.setItem('searchPageData', state)
  }

  onSearchChange = (event) => {
    this.setState({ searchValue: event.target.value, loading: true, error: false })
  }

  onPaginationChange = (paginationValue) => this.setState({ paginationValue })

  render() {
    const { movies, error, loading, allMovies, searchValue, paginationValue } = this.state
    return (
      <section className="app__content">
        <Input
          className="app__search"
          type="text"
          placeholder="Type to search ..."
          value={searchValue}
          onChange={this.onSearchChange}
        />
        <MovieList movies={movies} loading={loading} error={error} />
        <Pagination
          className="app__pagination"
          size="small"
          showSizeChanger={false}
          current={paginationValue}
          total={allMovies}
          onChange={this.onPaginationChange}
        />
      </section>
    )
  }
}
