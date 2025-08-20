import { Link } from "@inertiajs/react";
export default function Search({ users, query }) {
    return (
        <div className="p-6 min-h-screen flex flex-col justify-center items-center">
            <h1 className="font-bold text-4xl mb-4">
                Resultat pour : "{query} "
            </h1>
            {users.length > 0 ? (
                <ul className="space-y-2">
                    {users.map((user) => (
                        <li key={user.id} className="border p-2 rounded">
                            <p className="font-medium">{user.name}</p>
                            <Link
                                href={`/users/${user.id}`}
                                className="text-blue-600 hover:underline"
                            >
                                Voir le profil
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Aucun utilisateur trouvé.</p>
            )}
        </div>
    );
}
