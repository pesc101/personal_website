import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const publications = [
    {
        title: "LEMUR: A Corpus for Robust Fine-Tuning of Multilingual Law Embedding Models for Retrieval",
        authors: "Narges Baba Ahmadi, Jan Strich, Martin Semmann, Chris Biemann",
        venue: "EACL SRW",
        year: "2026",
        abstract:
            "Large language models are increasingly used to access legal information. Yet, their deployment in multilingual legal settings is constrained by unreliable retrieval and the lack of domain-adapted, open-embedding models. We present LEMUR, a corpus designed for semantic retrieval in multilingual legal contexts.",
        links: { paper: "https://arxiv.org/abs/2602.09570", pdf: "https://arxiv.org/pdf/2602.09570" },
    },
    {
        title: "Comprehensive Comparison of RAG Methods Across Multi-Domain Conversational QA",
        authors: "Klejda Alushi, Jan Strich, Chris Biemann, Martin Semmann",
        venue: "EACL SRW",
        year: "2026",
        abstract:
            "Conversational question answering increasingly relies on retrieval-augmented generation (RAG) to ground large language models in external knowledge. This paper provides the first systematic comparison of RAG methods for multi-turn conversational QA across multiple domains, addressing challenges such as dialogue history and coreference resolution.",
        links: { paper: "https://arxiv.org/abs/2602.09552", pdf: "https://arxiv.org/pdf/2602.09552" },
    },
    {
        title: "T²-RAGBench: Text-and-Table Benchmark for Evaluating Retrieval-Augmented Generation",
        authors: "Jan Strich, Enes Kutay Isgorur, Maximilian Trescher, Chris Biemann, Martin Semmann",
        venue: "EACL Main",
        year: "2026",
        abstract:
            "Since many real-world documents combine textual and tabular data, robust RAG systems are essential for effectively accessing and analyzing such content. We introduce T²-RAGBench, a benchmark comprising 23,088 question-context-answer triples designed to evaluate RAG methods on real-world documents with mixed text and tables.",
        links: { paper: "https://arxiv.org/abs/2506.12071", pdf: "https://arxiv.org/pdf/2506.12071" },
    },
    {
        title: "MTabVQA: Evaluating Multi-Tabular Reasoning of Language Models in Visual Space",
        authors: "Anshul Singh, Chris Biemann, Jan Strich",
        venue: "EMNLP Findings",
        year: "2025",
        abstract:
            "Vision-Language Models (VLMs) have demonstrated remarkable capabilities in interpreting visual layouts and text. However, a significant challenge remains in their ability to reason over multi-tabular data presented as images — a common occurrence in real-world scenarios like web pages and digital documents. We introduce MTabVQA to benchmark this capability.",
        links: { paper: "https://aclanthology.org/2025.findings-emnlp.1083/", pdf: "https://aclanthology.org/2025.findings-emnlp.1083.pdf" },
    },
    {
        title: "EncouRAGe: Evaluating RAG Local, Fast, and Reliable",
        authors: "Jan Strich, Adeline Scharfenberg, Chris Biemann, Martin Semmann",
        venue: "Preprint",
        year: "2025",
        abstract:
            "We introduce EncouRAGe, a comprehensive Python framework designed to streamline the development and evaluation of Retrieval-Augmented Generation (RAG) systems. EncouRAGe comprises five modular and extensible components — Type Manifest, RAG Factory, Inference, Vector Store, and Metrics — facilitating flexible experimentation.",
        links: { paper: "https://arxiv.org/abs/2511.04696", pdf: "https://arxiv.org/pdf/2511.04696" },
    },
    {
        title: "Visual Question Answering on Scientific Charts Using Fine-Tuned Vision-Language Models",
        authors: "Florian Schleid, Jan Strich, Chris Biemann",
        venue: "ACL Workshop",
        year: "2025",
        abstract:
            "We investigate the ability of fine-tuned vision-language models to answer questions about scientific charts. Our work evaluates multiple VLMs on chart-based VQA tasks and demonstrates improvements through domain-specific fine-tuning.",
        links: { paper: "https://aclanthology.org/2025.sdp-1.19/", pdf: "https://aclanthology.org/2025.sdp-1.19.pdf" },
    },
    {
        title: "Adapt LLM for Multi-turn Reasoning QA using Tidy Data",
        authors: "Jan Strich",
        venue: "COLING Workshop",
        year: "2025",
        abstract:
            "We present a submission to the Fin-DBQA shared task at the 9th FinNLP workshop, tackling finance-focused multi-turn QA with step-by-step reasoning and Python code generation. By pre-processing data into tidy data format, all evaluated models surpass state of the art, with GPT-4o achieving 50.62% accuracy and second place on the shared task leaderboard.",
        links: { paper: "https://aclanthology.org/2025.finnlp-1.45/", pdf: "https://aclanthology.org/2025.finnlp-1.45.pdf" },
    },
    {
        title: "On Improving Repository-Level Code QA for Large Language Models",
        authors: "Jan Strich, Florian Schneider, Irina Nikishina, Chris Biemann",
        venue: "ACL SRW",
        year: "2024",
        abstract:
            "We explore methods to improve repository-level code question answering using large language models. Our work proposes techniques to better leverage repository structure and context, improving LLMs' ability to answer questions that require understanding of an entire codebase.",
        links: { paper: "https://aclanthology.org/2024.acl-srw.28/", pdf: "https://aclanthology.org/2024.acl-srw.28.pdf" },
    },
]

export default function Publications() {
    return (
        <div className="space-y-4">
            <p className="text-muted-foreground">
                Selected publications. For a full list, see{" "}
                <a href="https://scholar.google.com/citations?user=ZOV6IUEAAAAJ" className="underline text-foreground" target="_blank" rel="noopener noreferrer">
                    Google Scholar
                </a>
                .
            </p>
            {publications.map((pub) => (
                <Card key={pub.title}>
                    <CardHeader>
                        <div className="flex flex-wrap gap-2 mb-1">
                            <Badge>{pub.venue}</Badge>
                            <Badge variant="outline">{pub.year}</Badge>
                        </div>
                        <CardTitle className="text-base leading-snug">{pub.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{pub.authors}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">{pub.abstract}</p>
                        <div className="flex gap-2 flex-wrap">
                            {pub.links.paper && (
                                <Button variant="outline" size="sm" asChild>
                                    <a href={pub.links.paper} target="_blank" rel="noopener noreferrer">Paper</a>
                                </Button>
                            )}
                            {pub.links.pdf && (
                                <Button variant="outline" size="sm" asChild>
                                    <a href={pub.links.pdf} target="_blank" rel="noopener noreferrer">PDF</a>
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
