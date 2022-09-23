import React from 'react'
import { Tabs, Alert } from 'antd'

import SearchContent from '../SearchContent/search-content'
import RatedContent from '../RatedContent/rated-content'
import { GenreProvider } from '../GenresContext/genres-context'
import ApiService from '../../api-service'

import './app.css'

export default class App extends React.Component {
  state = {
    currentPage: 'search',
    error: null,
    genres: null,
  }

  componentDidMount() {
    window.addEventListener('offline', () => {
      this.setState({ error: new Error('No internet connection') })
    })
    window.addEventListener('online', () => {
      this.setState({ error: null })
    })
    this.getGenres()
  }

  getGenres = () => {
    ApiService.getGenres()
      .then((genres) => this.setState({ genres }))
      .catch((error) => this.setState({ error }))
  }

  render() {
    const { currentPage, genres, error } = this.state
    const optionPage = [
      { label: 'Search', key: 'search' },
      { label: 'Rated', key: 'rated' },
    ]
    let body

    switch (currentPage) {
      case 'search':
        body = <SearchContent />
        break
      case 'rated':
        body = <RatedContent />
        break

      default:
        break
    }

    return (
      <GenreProvider value={genres}>
        {error ? <Alert message={error.message} type="error" showIcon /> : null}
        <main className="app">
          <Tabs items={optionPage} />
          {body}
        </main>
      </GenreProvider>
    )
  }
}
