import React from 'react'
import { Card, Tag, Rate, Typography, Spin } from 'antd'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

import ApiService from '../../api-service'
import './movie.css'

const { Title, Paragraph, Text } = Typography

export default class Movie extends React.Component {
  state = {
    img: null,
  }

  componentDidMount() {
    const { movie } = this.props
    ApiService.getPoster(movie.poster_path)
      .then((url) => this.setState({ img: url }))
      .catch(() => this.setState({ img: 'No such image' }))
  }

  render() {
    const { movie } = this.props
    const { img } = this.state
    const cover = img ? <img src={img} alt={movie.original_title} /> : <Spin />
    const date = parseISO(movie.release_date)

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
        <Text className="movie__date">{format(date, 'MMMM d, y')}</Text>
        <Tag className="movie__tag">Genre is:</Tag>
        <Paragraph className="movie__overview">{briefOverview}</Paragraph>
        <Rate defaultValue={0} count={10} />
      </Card>
    )
  }
}
