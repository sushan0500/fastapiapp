import type {Company} from "../types/company";

type Props = {
    companies:Company[];
}
function CompanyCard({
    Companies}:Props){
    // const [companies, setCompanies] = useState<Company[]>([]);

    // async function fetchCompanies() {
    //     const companies = await getCompanies();
    //     setCompanies(companies);
    // }

    // useEffect(() => {
    //     fetchCompanies();
    // }, []);

    return (
        <div>
            <h2>Companies</h2>

            {companies.map((company) => (
                <div key={company.id}>
                    <h1>{company.name}</h1>
                    <p>Email: {company.email}</p>
                    <p>Phone: {company.phone}</p>
                    <p>Location: {company.location}</p>
                    <hr></hr>
                </div>
            ))}
        </div>
    );
}

export default CompanyCard;