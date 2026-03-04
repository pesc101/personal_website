export interface GitHubStats {
    totalStars: number;
    totalContributions: number;
}

const GITHUB_API = "https://api.github.com";
const GRAPHQL_API = "https://api.github.com/graphql";

function authHeaders(): HeadersInit {
    const token = process.env.GITHUB_TOKEN;
    return {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

/**
 * Sums stargazers_count across all public repositories for a given GitHub username.
 */
async function fetchTotalStars(username: string): Promise<number> {
    let page = 1;
    let total = 0;

    while (true) {
        const res = await fetch(
            `${GITHUB_API}/users/${encodeURIComponent(username)}/repos?per_page=100&page=${page}`,
            { headers: authHeaders(), next: { revalidate: 3600 } }
        );

        if (!res.ok) {
            throw new Error(`GitHub REST API responded with status ${res.status}`);
        }

        const repos: { stargazers_count: number }[] = await res.json();
        if (repos.length === 0) break;

        total += repos.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0);
        if (repos.length < 100) break;
        page++;
    }

    return total;
}

/**
 * Fetches the total contribution count for the current year using the GitHub GraphQL API.
 * Requires a GITHUB_TOKEN environment variable with at least read:user scope.
 */
async function fetchTotalContributions(username: string): Promise<number> {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        throw new Error(
            "GITHUB_TOKEN is not set. A personal access token is required to fetch contribution data via the GraphQL API."
        );
    }

    const query = `
        query($login: String!) {
            user(login: $login) {
                contributionsCollection {
                    contributionCalendar {
                        totalContributions
                    }
                }
            }
        }
    `;

    const res = await fetch(GRAPHQL_API, {
        method: "POST",
        headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables: { login: username } }),
        next: { revalidate: 3600 },
    });

    if (!res.ok) {
        throw new Error(`GitHub GraphQL API responded with status ${res.status}`);
    }

    const json: {
        data?: {
            user?: {
                contributionsCollection?: {
                    contributionCalendar?: { totalContributions: number };
                };
            };
        };
        errors?: { message: string }[];
    } = await res.json();

    if (json.errors?.length) {
        throw new Error(`GitHub GraphQL error: ${json.errors[0].message}`);
    }

    const contributions =
        json.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions;

    if (contributions === undefined) {
        throw new Error("Could not parse contribution data from GitHub GraphQL response.");
    }

    return contributions;
}

/**
 * Fetches both total stars and total contributions for a GitHub username.
 */
export async function fetchGitHubStats(username: string): Promise<GitHubStats> {
    const [totalStars, totalContributions] = await Promise.all([
        fetchTotalStars(username),
        fetchTotalContributions(username),
    ]);

    return { totalStars, totalContributions };
}
