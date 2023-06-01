import { getAccessTokenFromCode } from "../components/Login";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Page(props) {
    const router = useRouter();

    useEffect(() => {
        if (props.authenticated !== undefined) {
            setTimeout(() => {
                router.push('/')
            }, 2000)
        }
    }, [props.authenticated])

    return (
        <div>
            Authenticated. Please wait while you are redirected.
        </div>
    )
}

export const getServerSideProps = async ({req, res, query}) => {
    if (query.code) {
        const token = await getAccessTokenFromCode(query.code, req, res)
        // console.log(token)
    }

    return {
        props: { authenticated: true }
    } 
}