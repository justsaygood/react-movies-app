import React from 'react'
import { Col, Row } from 'antd/lib/grid'
import { Spin, Alert } from 'antd'

import Movie from '../Movie/movie'
import './movie-list.css'

export default function MovieList({ movies, loading, error, offline }) {
  let items = null
  if (movies) {
    items = movies.map((movie) => (
      <Col className="movie-list__item" xs={24} sm={24} md={24} lg={12} key={movie.id}>
        <Movie movie={movie} />
      </Col>
    ))
  }
  if (loading) {
    items = (
      <div className="spinner-wrapper">
        <Spin className="spinner" size="large" />
      </div>
    )
  }
  if (error) {
    items = <Alert message={error.message} type="error" showIcon />
  }
  if (offline) {
    items = <Alert message="No internet connection" type="error" showIcon />
  }
  return (
    <section className="movie-list">
      <Row gutter={[32, 32]}>{items}</Row>
    </section>
  )
}
