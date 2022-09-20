import React from 'react'
import { Tabs } from 'antd'

import SearchContent from '../SearchContent/search-content'
import RatedContent from '../RatedContent/rated-content'

import './app.css'

export default class App extends React.Component {
  state = {
    currentPage: 'search',
  }

  render() {
    const { currentPage } = this.state
    const optionPage = [
      { label: 'SearchContent', key: 'search' },
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
    const { TabPane } = Tabs
    return (
      <main className="app">
        <Tabs items={optionPage}>
          <TabPane tab="Search" />
          <TabPane tab="Rated" />
        </Tabs>
        {body}
      </main>
    )
  }
}
