export interface ScholarStats {
    citations: number;
    citationsSince2020: number;
    hIndex: number;
    hIndexSince2020: number;
    i10Index: number;
    i10IndexSince2020: number;
}

/**
 * Fetches citation statistics from a Google Scholar profile page.
 * Parses the #gsc_rsb_st table which contains all-time and recent metrics.
 *
 * @param userId - The Google Scholar user ID (e.g. "ZOV6IUEAAAAJ")
 */
export async function fetchScholarStats(userId: string): Promise<ScholarStats> {
    const url = `https://scholar.google.com/citations?user=${encodeURIComponent(userId)}&hl=en`;

    const res = await fetch(url, {
        headers: {
            // Mimic a real browser to avoid being blocked
            "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        // Cache for 1 hour in Next.js data cache
        next: { revalidate: 3600 },
    });

    if (!res.ok) {
        throw new Error(`Google Scholar responded with status ${res.status}`);
    }

    const html = await res.text();

    // Extract all values inside <td class="gsc_rsb_std">…</td>
    // The table has 3 rows × 2 columns (all-time, since-2020):
    //   Row 0: Citations      [0] all-time  [1] since-2020
    //   Row 1: h-index        [2] all-time  [3] since-2020
    //   Row 2: i10-index      [4] all-time  [5] since-2020
    const cellRegex = /<td class="gsc_rsb_std">([\d,]+)<\/td>/g;
    const values: number[] = [];
    let match: RegExpExecArray | null;

    while ((match = cellRegex.exec(html)) !== null) {
        values.push(parseInt(match[1].replace(/,/g, ""), 10));
    }

    if (values.length < 6) {
        throw new Error(
            `Could not parse Scholar stats – expected 6 cells, found ${values.length}. ` +
            "Google Scholar may have changed its HTML structure or is rate-limiting requests."
        );
    }

    return {
        citations: values[0],
        citationsSince2020: values[1],
        hIndex: values[2],
        hIndexSince2020: values[3],
        i10Index: values[4],
        i10IndexSince2020: values[5],
    };
}
