import { IResourceComponentsProps } from "@refinedev/core";
import { useParams } from "react-router-dom";
import { CleanQueue } from "./WarningZones/CleanQueue";
import { RemoveJobs } from "./WarningZones/RemoveJobs";
import { EmptyQueue } from "./WarningZones/EmptyQueue";
import { ObliterateQueue } from "./WarningZones/ObliterateQueue";

export const WarningZone: React.FC<IResourceComponentsProps> = () => {
    const params = useParams<{ name: string }>()

    if (params.name)
        return <>
            <RemoveJobs />
            <EmptyQueue />
            <CleanQueue />
            <ObliterateQueue />
        </>

    return null;
}