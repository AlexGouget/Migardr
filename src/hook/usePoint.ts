import useSWR from "swr";

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then(res => res.json())

function usePoint(){
    const {data, error, isLoading } = useSWR('/api/point', fetcher)
    return {point: data, error, isLoading}
}

export default usePoint