import { QuestionType } from "../type";
import axios from "axios";

function getApiUrlForGameMode(gameMode: string, difficulty: string, numberOfQuestions: number): string {
    const baseUrl = process.env.API_URL;

    if (!baseUrl) {
        throw new Error("L'URL de l'API n'est pas définie dans le fichier .env");
    }
    switch (gameMode) {
        
        case "Truth":
            return `${baseUrl}/Truth/Get/${numberOfQuestions}?difficulty=${difficulty}`;
        case "Dare":
            return `${baseUrl}/Dare/Get/${numberOfQuestions}?difficulty=${difficulty}`;
        case "NeverHaveI":
            return `${baseUrl}/NeverHaveIEver/Get/${numberOfQuestions}?difficulty=${difficulty}`;
        case "WouldYouRather":
            return `${baseUrl}/WouldYouRather/Get${numberOfQuestions}?difficulty=${difficulty}`;
        case "MostLikelyTo":
            return `${baseUrl}/Paranoia/Get/${numberOfQuestions}?difficulty=${difficulty}`;
        default:
            return ``;
    }
}


export async function fetchQuestions(gameMode: string, difficulty: string, numberOfQuestions: number): Promise<QuestionType[]> {
    try {
        const apiUrl = getApiUrlForGameMode(gameMode, difficulty, numberOfQuestions);
        const response = await axios.get(apiUrl);
        const questions = response.data;

        const formattedQuestions = questions.map((q: any) => ({
            q_fr: q.questionFr,
            q_en: q.questionEn,
            cA_fr: q.proposalAFr || "Réponse A non disponible",
            cB_fr: q.proposalBFr || "Réponse B non disponible",
            cA_en: q.proposalAEn || "Answer A not available",
            cB_en: q.proposalBEn || "Answer B not available",
        }));

        console.log("Fetched questions:", formattedQuestions);
        return formattedQuestions;
    } catch (error) {
        console.error("Erreur lors de la récupération des questions pour fetchQuestions :", error);
        return [];
    }
}


export async function fetchQuestionsTruthOrDare(
    difficulty: string,
    numberOfQuestions: number
): Promise<QuestionType[]> {
    try {
        // Récupérer les questions "Truth"
        const truthApiUrl = getApiUrlForGameMode("Truth", difficulty, numberOfQuestions);
        console.log("truthApiUrl", truthApiUrl);
        const truthResponse = await axios.get(truthApiUrl);
        const truthQuestions = truthResponse.data.map((q: any) => ({
            q_fr: q.questionFr,
            q_en: q.questionEn,
        }));

        // Récupérer les questions "Dare"
        const dareApiUrl = getApiUrlForGameMode("Dare", difficulty, numberOfQuestions);
        console.log("dareApiUrl", dareApiUrl);
        const dareResponse = await axios.get(dareApiUrl);
        const dareQuestions = dareResponse.data.map((q: any) => ({
            q_fr: q.questionFr,
            q_en: q.questionEn,
        }));

        // Fusionner action et vérité dans un format unique
        const formattedQuestions: QuestionType[] = [];
        for (let i = 0; i < Math.min(truthQuestions.length, dareQuestions.length); i++) {
            formattedQuestions.push({
                q_fr: "Action ou Vérité ?",
                q_en: "Truth or Dare ?",
                cA_fr: dareQuestions[i].q_fr, // Action
                cA_en: dareQuestions[i].q_en,
                cB_fr: truthQuestions[i].q_fr, // Vérité
                cB_en: truthQuestions[i].q_en,
            });
        }

        console.log("Fetched Truth or Dare questions:", formattedQuestions);
        return formattedQuestions;
    } catch (error) {
        console.error("Erreur lors de la récupération des questions pour fetchQuestionsTruthOrDare :", error);
        return [];
    }
}
