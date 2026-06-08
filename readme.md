# AI Powered CV-Screening Application

This is an AI-powered CV screening application built using SAP CAP (Cloud Application Programming Model). Users can create or update candidate records manually, or upload a CV file for AI analysis and automated data extraction.

## Getting Started

1. **Clone the repository**:
```bash
git clone https://github.com/amitHarwani/cv_screener
```

2. **Create a `.env` file with the following values**:
- `GEMINI_API_KEY`: Your Gemini API Key
- `GEMINI_MODEL`: The AI model to use for CV analysis

3. **Run the application**
```bash
cds watch
```

## Backend Overview

The backend is implemented under the `srv/` and `db/` folders.

### Candidate Entity

The candidate entity is defined in `db/schema.cds` and includes the following fields:
- `FullName`
- `Email`
- `Phone`
- `Skills`
- `YearsOfExperience`
- `CurrentRole`
- `CVText`
- `AISummary`
- `FileName`
- `Content` (`LargeBinary`)
- `FileType` (`String`)

`Content` is stored as binary media content and is annotated with `@Core.MediaType` and `@Core.ContentDisposition.Filename` so that uploaded CV files are handled as media content.
NOTE: The CV files are not stored in the table, the LargeBinary field is only used to enable the binary stream uploads. The PUT request is intercepted, and the file is stored in the local directory

### Upload Route Override

The `UPDATE` route is overridden in `srv/candidate_service.js` to support CV uploads.

When a request contains `req.data.Content`, the custom handler:
- reads the candidate record by `ID`
- streams CV bytes into a buffer
- saves the CV file locally under `local_cv_store/`
- extracts text from the uploaded PDF or DOCX file
- sends the extracted text to the Gemini AI analysis function
- updates the candidate record with AI-populated fields

This custom logic allows the app to treat the file upload as an `UPDATE` of the candidate's media content while still using the CAP service layer.

### Directory Structure (Backend)

- `db/schema.cds` - Candidate entity, media annotations, and model definitions
- `srv/candidate_service.cds` - Service projection exposing the `Candidates` entity
- `srv/candidate_service.js` - Custom `UPDATE` hook for CV uploads and AI processing
- `srv/utils/cvutils.js` - CV extraction, local storage, and Gemini analysis helpers
- `local_cv_store/` - Saved CV files from uploads

## Frontend Overview

The frontend is built as a SAP Fiori Elements UI application under `app/cv-screener-ui/`.

### Upload Section

A custom upload section is added using a Custom Section and Fragment under the Object Page:
- `app/cv-screener-ui/webapp/ext/fragment/CVScreening.fragment.xml`
- `app/cv-screener-ui/webapp/ext/fragment/CVScreening.js`

This fragment adds a `FileUploader`, a `ProgressIndicator`, and an upload button to the candidate object page.

### XHR Progress Upload

The upload flow uses `XMLHttpRequest` in `CVScreening.js` to send the raw binary CV file directly to the backend.

Key behaviors:
- the selected file is uploaded with a `PUT` request to the candidate's `Content` media endpoint
- `xhr.upload.addEventListener('progress', ...)` updates the progress bar during upload
- a `BusyDialog` shows while the backend analyzes the CV
- on success, the UI refreshes candidate fields

