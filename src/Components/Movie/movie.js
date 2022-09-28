import React from 'react'
import { Card, Rate, Typography, Spin } from 'antd'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

import noPoster from '../../Images/noPoster.png'
import ApiService from '../../api-service'
import Genres from '../Genres/genres'
import { GenreConsumer } from '../GenresContext/genres-context'

import './movie.css'

const { Title, Paragraph, Text } = Typography

export default class Movie extends React.Component {
  state = {
    img: null,
    stars: 0,
  }

  componentDidMount() {
    const { movie } = this.props
    ApiService.getPoster(movie.poster_path)
      .then((url) => this.setState({ img: url }))
      .catch(() => this.setState({ img: noPoster }))

    try {
      const stars = JSON.parse(localStorage.getItem('stars'))
      if (stars[movie.id]) {
        this.setState({ stars: stars[movie.id] })
      }
    } catch {
      localStorage.setItem('stars', '{}')
    }
  }

  setRating = (value) => {
    const { movie } = this.props
    ApiService.rateMovie(movie.id, value).then(() => {
      const stars = localStorage.getItem('stars')
      if (!stars) localStorage.setItem('stars', '{}')
      const newObject = JSON.parse(stars)
      newObject[movie.id] = value
      localStorage.setItem('stars', JSON.stringify(newObject))
      this.setState({ stars: value })
    })
  }

  render() {
    const { movie } = this.props
    const { img, stars } = this.state
    const cover = img ? <img src={img} alt={movie.original_title} /> : <Spin />
    const date = movie.release_date ? format(parseISO(movie.release_date), 'MMMM d, y') : null

    function summary(numberSymbols, useWordBoundary) {
      if (this.length <= numberSymbols) {
        return this
      }
      const subString = this.substring(0, numberSymbols - 1)
      return `${useWordBoundary ? subString.substring(0, subString.lastIndexOf(' ')) : subString} ...`
    }

    const briefOverview = summary.apply(movie.overview, [160, true])
    const rating = Math.round(movie.vote_average * 10) / 10

    let movieRating = 'movie__rating'

    if (rating <= 3) movieRating = 'movie__rating movie__rating--red'
    if (rating <= 5) movieRating = 'movie__rating movie__rating--orange'
    if (rating <= 7) movieRating = 'movie__rating movie__rating--yellow'
    if (rating > 7) movieRating = 'movie__rating movie__rating--green'

    return (
      <Card className="movie" cover={cover} bordered={false} ref={this.card}>
        <Title className="movie__title">
          {movie.original_title}
          <div className={movieRating}>{rating}</div>
        </Title>
        <Text className="movie__date">{date}</Text>
        <GenreConsumer>{(genres) => <Genres genres={genres} movieGenres={movie.genre_ids} />}</GenreConsumer>
        <Paragraph className="movie__overview">{briefOverview}</Paragraph>
        <Rate className="movie__stars" defaultValue={0} count={10} value={stars} onChange={this.setRating} />
      </Card>
    )
  }
}
