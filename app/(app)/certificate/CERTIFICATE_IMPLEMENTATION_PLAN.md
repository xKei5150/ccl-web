# Certificate Generation Feature: Implementation Plan

This document outlines the plan to implement the certificate generation feature for the barangay application. The goal is to allow users to generate printable certificates (Residency, Indigency, Clearance, Business Clearance) based on data from `general-requests`.

## 1. Project Setup & Route

*   **Route:** Certificates will be accessible via a dynamic route: `app/(app)/certificate/[id]/page.jsx`. The `[id]` will correspond to the ID of a `general-request`.
*   **Query Parameter for Type (Optional but Recommended):** Consider using a query parameter to specify the certificate type if a single request can be used for multiple types, e.g., `app/(app)/certificate/[id]?type=residency`. This makes the certificate page more flexible.

## 2. Data Model & Fetching

*   **Primary Data Source:** The "requests" collection in PayloadCMS, as defined in `collections/Requests.ts`.
    *   The `type` field (e.g., `request.type`) in the "requests" collection will determine the certificate to generate (`indigencyCertificate`, `barangayClearance`, `barangayResidency`).
*   **Secondary Data Source:** The "personal-information" collection in PayloadCMS, as defined in `collections/PersonalInformation.ts`.
    *   The `request.person` field (relationship) links to this collection.
*   **Data Fetching:**
    *   The `app/(app)/certificate/[id]/page.jsx` server component will use `getRequest(id)` from `app/(app)/dashboard/general-requests/actions.js`.
    *   **Important:** This action must fetch the related `personal-information` document (e.g., by ensuring `depth: 1` or greater in the underlying Payload query for the `person` field).
*   **Field Mapping - `personal-information` to Certificate Data:**
    *   **Applicant Name:** `personalInfo.name.fullName` (or construct from `firstName`, `middleName`, `lastName`).
    *   **Applicant Address:** `personalInfo.contact.localAddress`. The static part "Malabanban Norte Candelaria, Quezon" will be appended by the certificate component.
    *   **Applicant Sex:** `personalInfo.demographics.sex`.
    *   **Applicant Birthdate:** `personalInfo.demographics.birthDate`.
    *   **Applicant Age:** Will be calculated from `personalInfo.demographics.birthDate`.
    *   **Applicant Marital Status:** `personalInfo.demographics.maritalStatus`.
    *   **Applicant Photo (for Barangay Clearance):** `personalInfo.photo` (this is an upload field).
*   **Available Fields from `Requests.ts`:**
    *   `request.type`: Determines certificate type.
    *   `request.purpose`: General purpose of the request.
    *   `request.additionalInformation.forWhom`: For Indigency Certificate.
    *   `request.additionalInformation.remarks`: For Barangay Clearance.
    *   `request.additionalInformation.duration`: For Barangay Residency.
    *   `request.createdAt` / `request.updatedAt`: Can be used for issue dates.
*   **Placeholders & Future Considerations (Data not in current `Requests.ts` or `PersonalInformation.ts`):**
    *   **Control Numbers:** Will use placeholders (e.g., "CN-YYYY-XXXXX"). *Consideration: Add a `controlNumber` field to `Requests.ts`, potentially auto-generated or manually entered.*
    *   **CTC Details (Number, Date Issued, Place Issued, Amount):** Will use placeholders. *Consideration: Add a group field for CTC details to `Requests.ts`.*
    *   **Barangay Clearance Specifics:**
        *   `orNumber`, `clearanceAmount`, `validUntil`: Will use placeholders. The validity is stated as 6 months on the image. *Consideration: Add these fields to `Requests.ts` under `additionalInformation` conditional on `type === 'barangayClearance'`.*
    *   **Barangay Business Clearance:** This certificate type is **not defined** as an option in `Requests.ts.type`.
        *   *Consideration: Add `barangayBusinessClearance` to `Requests.ts.type.options`. All its specific fields (`businessName`, `permitNumber`, `orNumber`, `amountPaid`, etc.) would also need to be added to `Requests.ts`, likely under `additionalInformation` conditional on this new type.* For now, this certificate cannot be implemented.
    *   **Citizenship:** Not available in `PersonalInformation.ts`. Will use a placeholder (e.g., "Filipino"). *Consideration: Add a `citizenship` field to `PersonalInformation.ts`.*
*   **Barangay Officials Data:**
    *   Names and titles of barangay officials will be initially hardcoded in the `CertificateLayout.jsx` or individual certificate components, based on the provided images.
    *   *Consideration: For dynamic updates, this data could be fetched from a separate "BarangayOfficials" PayloadCMS collection in the future.*

## 3. Component Structure

*   **Main Page Component (`app/(app)/certificate/[id]/page.jsx`):**
    *   Server component.
    *   Fetches request data using `getRequest(id)`.
    *   Determines which specific certificate component to render based on `request.type` or query param.
    *   Wraps the certificate component in a layout that includes a "Print" button.
*   **Shared Layout Component (`@/components/certificate/CertificateLayout.jsx`):**
    *   Contains the common header (Republic, Province, Municipality, Barangay Name, logos) and footer (Office address, contact, tagline).
    *   Includes the sidebar for Barangay Officials.
    *   This component will wrap the specific certificate content.
*   **Specific Certificate Components (e.g., `@/components/certificate/BarangayResidencyCertificate.jsx`):**
    *   Server components, each responsible for rendering one type of certificate.
    *   Receive the `request` data object as a prop.
    *   Map data fields to the certificate layout.
    *   Implement the unique structure and text for each certificate type based on the provided images.
    *   Will use Tailwind CSS for styling.
    *   Example components:
        *   `BarangayResidencyCertificate.jsx`
        *   `BarangayIndigencyCertificate.jsx` (May need conditional logic or sub-components for variants like "Medical Assistance").
        *   `BarangayClearanceCertificate.jsx`
        *   `BarangayBusinessClearance.jsx`
*   **Print Button (`@/components/certificate/PrintButton.jsx`):**
    *   Client component (`'use client'`).
    *   A simple button that, when clicked, calls `window.print()`.
    *   Should be styled to be noticeable but unobtrusive.

## 4. UI/UX and Styling

*   **Visual Fidelity:** Replicate the layout, fonts, spacing, and image placements from the provided certificate images as closely as possible using Tailwind CSS.
*   **Responsive Design:** While primarily designed for print, the on-screen view should be reasonably presented.
*   **Print Styles (`@media print`):**
    *   Crucial for ensuring the printed output is clean and accurate.
    *   Hide non-certificate elements (e.g., site navigation, the print button itself, scrollbars).
    *   Ensure proper page breaks if a certificate were ever to span multiple pages (unlikely for these single-page designs).
    *   Optimize for standard paper sizes (A4 or Letter). Test printing to PDF.
*   **Image Assets:**
    *   Static logos/seals (Barangay logo, Philippine flag/seal) will be placed in `public/assets/images/` and referenced directly.
    *   The applicant's photo for Barangay Clearance will be sourced from `personalInfo.photo` (via PayloadCMS uploads).
    *   *Consideration: For more dynamic static assets, their paths could be stored in a global configuration in PayloadCMS.*

## 5. Content and Dynamic Data

*   All text content from the certificate images (headers, static paragraphs, field labels) should be included in the components.
*   Dynamic data (names, dates, addresses, control numbers, etc.) will be injected from the `request` prop.
*   Handle potential missing data gracefully (e.g., display "N/A" or a blank space, depending on the field).

## 6. Key Functionalities

*   **Certificate Selection:**
    *   The certificate type will be determined by the `request.type` field from the fetched request data (values: `indigencyCertificate`, `barangayClearance`, `barangayResidency`).
    *   The UI will then render the corresponding certificate component. No query parameter is strictly needed if `request.type` is reliable.
*   **Dynamic Content Population:** Fields must accurately reflect the data from the `general-request` and the related `personal-information`.
*   **Print Functionality:** A clear "Print" button that triggers the browser's print dialog.

## 7. Development Workflow & File Structure

*   **Directory:** `app/(app)/certificate/` for the main page and plan.
*   **Components:** `components/certificate/` for reusable parts like `CertificateLayout.jsx`, `PrintButton.jsx`, and the individual certificate type components.
*   **Styling:** Primarily Tailwind CSS within the JSX components. Global styles if absolutely necessary.
*   **Static Assets:** `public/assets/images/` for logos and seals.

## 8. Integration with General Requests

*   On the `app/(app)/dashboard/general-requests/page.jsx` (or its client component `GeneralRequestsPage`), add a "Generate Certificate" button/link for each request.
*   This button should navigate to `/certificate/[requestId]`.
*   If multiple certificate types can be generated from one request, the UI on the `GeneralRequestsPage` might need a dropdown to select the certificate type before navigating, or the certificate page itself will offer a selection.

## 9. Future Considerations

*   **Audit Trail:** Logging when certificates are generated.
*   **Configuration:** Making barangay official names, addresses, etc., configurable via PayloadCMS instead of hardcoding.
*   **Templates Management:** If more certificate types are added or existing ones change frequently, a more advanced templating system might be explored (though for a few types, individual components are fine).

## Action Items (Revised):

1.  **Implement Certificate Components:**
    *   Create `CertificateLayout.jsx`. (DONE)
    *   Create `BarangayResidencyCertificate.jsx`, `BarangayIndigencyCertificate.jsx`, `BarangayClearanceCertificate.jsx`.
        *   `BarangayResidencyCertificate.jsx` (DONE)
        *   `BarangayIndigencyCertificate.jsx` (DONE - handles variations for general and medical assistance)
        *   `BarangayClearanceCertificate.jsx` (DONE)
    *   These components will use placeholders for data fields not yet available in the schemas (Control No., CTC details, OR details, etc.) and for `citizenship`.
2.  **Develop `app/(app)/certificate/[id]/page.jsx`:** (DONE)
    *   Fetch request data and related personal information (ensure `depth` is set correctly in `getRequest` or add a separate fetch). (DONE - Assumes `getRequest` handles depth or fetches separately)
    *   Implement logic to select and render the correct certificate component based on `request.type`. (DONE)
    *   Pass fetched and processed data to the certificate components. (DONE)
    *   Calculate age from birthdate. (DONE)
3.  **Image Assets:** (PENDING)
4.  **Styling:** Apply Tailwind CSS for accurate visual replication and print styles. (PARTIALLY DONE - Basic print styles in components, further testing needed)
5.  **Print Button:** Create and integrate the `PrintButton.jsx` client component. (DONE)
6.  **Track Considerations:** Keep the list of "Placeholders & Future Considerations" in this document updated. This will serve as a backlog for future schema updates and feature enhancements. The "Barangay Business Clearance" is a significant item on this list. (ONGOING)

This plan will be updated as more information becomes available. 