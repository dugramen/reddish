

export function fetchData(url: string, setter: (a: any) => any) {
    // fetch("http://localhost:5000/" + url)
    fetch("api/cors/" + url)
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        throw new Error('Something wrong')
      })
      .then(data => {
        console.log(data)
        setter(data)
      })
      .catch(error => {})
  }