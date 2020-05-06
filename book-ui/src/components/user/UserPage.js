import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import BookList from './BookList'
import AuthContext from '../context/AuthContext'
import { bookApi } from '../misc/BookApi'

class UserPage extends Component {
  static contextType = AuthContext

  state = {
    books: [],
    bookTextSearch: '',
    isUser: true,
    isBooksLoading: false
  }

  componentDidMount() {
    const Auth = this.context
    const user = Auth.getUser()
    const isUser = user.role === 'USER'
    this.setState({ isUser })

    this.handleGetBooks()
  }

  handleInputChange = (e) => {
    const { id, value } = e.target
    this.setState({ [id]: value })
  }

  handleGetBooks = () => {
    const Auth = this.context
    const user = Auth.getUser()

    this.setState({ isBooksLoading: true })
    bookApi.getBooks(user)
      .then(response => {
        this.setState({ books: response.data })
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        this.setState({ isBooksLoading: false })
      })
  }

  handleSearchBook = () => {
    const Auth = this.context
    const user = Auth.getUser()

    const text = this.state.bookTextSearch
    bookApi.getBooks(user, text)
      .then(response => {
        if (response.status === 200) {
          const data = response.data;
          const books = data instanceof Array ? data : [data]
          this.setState({ books })
        } else {
          this.setState({ books: [] })
        }
      })
      .catch(error => {
        console.log(error)
        this.setState({ books: [] })
      })
  }

  render() {
    if (!this.state.isUser) {
      return <Redirect to='/' />
    } else {
      const { isBooksLoading, books, bookTextSearch } = this.state
      return (
        <Container>
          <BookList
            isBooksLoading={isBooksLoading}
            bookTextSearch={bookTextSearch}
            books={books}
            handleInputChange={this.handleInputChange}
            handleSearchBook={this.handleSearchBook}
          />
        </Container>
      )
    }
  }
}

export default UserPage