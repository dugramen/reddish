import Image from "next/image"

export function fetchAuth(url: string, options: RequestInit | undefined = undefined) {
  return fetch('api/reddit/?url=' + encodeURIComponent(url) + `&auth=1`, options)
}

export function fetchData(url: string, setter = (a: any) => {}): Promise<any> {
  // fetch("http://localhost:5000/" + url)
  const fullUrl = "/api/reddit/?url=" + encodeURIComponent(url)
  console.log('f = ', fullUrl)
  const result = fetch(fullUrl)
    .then(res => {
      if (res.ok) {
        return res.json()
      }
      throw new Error('Something wrong')
    })
    .catch(error => {})
  result.then((data => {
    console.log(data)
    setter(data)
  }))
  return result
}

export function ImageLoaded(props) {
    return <Image 
        src={props.src ?? ''}
        alt=''
        loader={() => props.src}
        unoptimized={true}
        {...props}
    />
}