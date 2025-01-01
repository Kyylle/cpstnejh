import os
from PyPDF2 import PdfReader
from docx import Document

# Function to extract text from a PDF file
def extract_text_from_pdf(file_path):
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        print(f"Error extracting text from {file_path}: {e}")
        return ""

# Function to extract text from a DOCX file
def extract_text_from_docx(file_path):
    try:
        doc = Document(file_path)
        text = "\n".join([p.text for p in doc.paragraphs])
        return text
    except Exception as e:
        print(f"Error extracting text from {file_path}: {e}")
        return ""

# Function to evaluate applications based on skills
def evaluate_application(text, required_skills):
    score = 0
    skills_found = []
    
    for skill in required_skills:
        if skill.lower() in text.lower():
            score += 1
            skills_found.append(skill)
    
    return score, skills_found

# Function to categorize applications based on scores
def categorize_applications(score, total_skills):
    if score == total_skills:
        return "Ready for Interview"
    elif score >= total_skills / 2:
        return "Potential Candidate"
    else:
        return "Not Qualified"

# Main function
def main():
    # Directory containing applications
    applications_dir = "applications"
    required_skills = ["Python", "Machine Learning", "Data Analysis", "Communication", "Problem Solving"]

    # Ensure the applications directory exists
    if not os.path.exists(applications_dir):
        print(f"Directory '{applications_dir}' does not exist.")
        return

    # Process each file in the directory
    for filename in os.listdir(applications_dir):
        file_path = os.path.join(applications_dir, filename)

        # Extract text based on file type
        if filename.endswith(".pdf"):
            text = extract_text_from_pdf(file_path)
        elif filename.endswith(".docx"):
            text = extract_text_from_docx(file_path)
        else:
            print(f"Skipping unsupported file type: {filename}")
            continue

        # Evaluate and categorize the application
        score, skills_found = evaluate_application(text, required_skills)
        category = categorize_applications(score, len(required_skills))

        # Output results
        print(f"File: {filename}")
        print(f"Skills Found: {skills_found}")
        print(f"Score: {score}/{len(required_skills)}")
        print(f"Category: {category}")
        print("-" * 40)

if __name__ == "__main__":
    main()
