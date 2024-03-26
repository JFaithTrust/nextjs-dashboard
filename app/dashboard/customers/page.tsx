
import { auth} from "@/auth";
import {useSession} from "next-auth/react";

const SettingsPage = async () => {
    // const { data: session } = useSession()
    const session = await auth()

    // @ts-ignore
    return (
        <div>{JSON.stringify(session)}</div>
    )
}

export default  SettingsPage