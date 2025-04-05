from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from app.services.vector_store import get_vector_db

def get_medical_analysis(text_chunks):
    """Generate medical analysis from text chunks"""
    prompt_template = """
You are a highly advanced AI medical assistant specializing in critical condition detection. Your task is to analyze structured patient data, including vital signs (heart rate, blood pressure, oxygen saturation, temperature), lab results, symptoms, and medical history, to identify patients in critical states.

Context:
{context}

Output Format:
- Doctor must see the following things
- Summarize data finding (show data and their conditions which do not match)
- Summarize Risk evaluation
- Food Recommendation
- Urgency to consult doctor
    """

    model = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.3)
    prompt = PromptTemplate(template=prompt_template, input_variables=["context"])
    chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)

    new_db = get_vector_db()
    docs = new_db.similarity_search("Analyze the patient data for critical conditions.")

    response = chain({"input_documents": docs}, return_only_outputs=True)
    return response["output_text"]

def ask_diet_question(input_question, report_text):
    """Generate response to diet-related question based on report"""
    # Step 1: Analyze the report for medical conditions
    analysis_prompt = f"""
You are a highly advanced AI medical assistant. Analyze the following medical report and identify any conditions, test results, or data that could influence dietary recommendations (e.g., diabetes, high cholesterol, hypertension, kidney issues, etc.).

Report:
{report_text}

Provide a concise summary of the key findings relevant to diet in one or two sentences.
    """

    model = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.3)
    analysis_response = model.invoke(analysis_prompt)
    analysis_summary = analysis_response.content

    # Step 2: Answer the user's diet-related question
    answer_prompt = f"""
You are an AI medical assistant specializing in dietary advice. Based on the analysis of a medical report, answer the user's diet-related question. If the report lacks specific dietary information, use the identified conditions or data to make an educated recommendation. If no relevant data is found, explain that and suggest consulting a doctor.

Report Analysis:
{analysis_summary}

User Question:
{input_question}

Provide a clear, concise answer to the user's question, focusing on whether the requested food or diet is suitable based on the report analysis.
    """

    model = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.3)
    response = model.invoke(answer_prompt)
    return response.content