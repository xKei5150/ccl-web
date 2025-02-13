import useFetch from "./useFetch";

function useReport(id) {
    const { data, loading, error, refetch} = useFetch(`/api/reports/${id}`);

    
    return { report: data, loading, error, refetch };
}

export default useReport;