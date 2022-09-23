import React from 'react'
import { Tag } from 'antd'

export default function Genres(props) {
  const { genres, movieGenres } = props
  const items = movieGenres.map((genreID) => (
    <Tag className="movie__tag" key={genreID}>
      {genres[genreID]}
    </Tag>
  ))
  return <div className="movie__genres">{items}</div>
}
