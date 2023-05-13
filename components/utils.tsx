import Image from "next/image"

export function fetchData(url: string, setter: (a: any) => any): Promise<any> {
  // fetch("http://localhost:5000/" + url)
  const result = fetch("api/cors/" + url)
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