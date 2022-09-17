import React from 'react'
import { Input } from 'antd'
import { debounce } from 'lodash'

export default class Search extends React.Component {
  state = {
    error: null,
    loading: false,
    movies: [],
  }

  render() {
    const { movies, error, loading } = this.state
    return (
      <section className="app">
        <Input className="app__search" />
      </section>
    )
  }
}
