export default class ApiService {
  static headers = new Headers({
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMDc0YTZiNzE2ZjllODAwN2JkNzQ2M2EyMWQ5YWIwZSIsInN1YiI6IjYzMWUzNDM5NjdkY2M5MDA3ZjViNGQxZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JhT7fJn7g35cW0FMIdHjbToFjuHyB_j_cZmFU2kNs4I',
  })

  apiKey = '2074a6b716f9e8007bd7463a21d9ab0e'

  static async getMovies() {
    const res = await fetch(
      'https://api.themoviedb.org/3/search/movie/?api_key=2074a6b716f9e8007bd7463a21d9ab0e&include_adult=false&query=return',
      {
        headers: this.headers,
      }
    )

    const body = await res.json()
    if (!res.ok) {
      throw new Error(`Could not load movies, received ${res.status}`)
    }
    return body
  }
}
