# INFO90006 Fieldwork for Design
## Design Concept — HearHere

**Team Sweet Potatoes — Group 14**

| Team Member | Student ID |
|---|---|
| Jia-Ying Lee | 1790130 |
| Xintong Fu | 1840227 |
| Yu-Hao Lu | 1781474 |
| Yen-Chu Ou Yang | 1801365 |

**Design concept video:** [Insert video link here]

---

## 1. Concept Overview

**HearHere** is a street-side civic information post paired with a mobile app. Its mascot, **Spud** (Street Post for Understanding Decisions), is the voice residents talk to. It helps international residents discover, understand, and respond to local government decisions in their own languages.

Our fieldwork found that the main barriers to civic participation are not necessarily a lack of interest, but difficulties finding relevant information, understanding government terminology, and knowing what happens after feedback is submitted (Themes 1–5).

HearHere addresses these barriers through two connected components:

- **Physical information post:** Helps residents discover relevant local issues, understand public information, and provide quick feedback along their everyday walking routes.
- **Mobile app:** Allows residents to save issues, receive notifications, access support, and track the progress of issues they care about.

The design aims to make civic participation more accessible, understandable, and convenient for international residents.

## 2. Key Features

### 2.1 Physical Information Post

The digital post is designed for everyday public spaces, such as library entrances and streets near university campuses.

**Side display — Council and community information**
- Displays verified council, library, and community event posters.
- Highlights relevant public activities and local information.
- Keeps civic information separate from commercial advertising to maintain trust.

**Upper touchscreen — Local issues and feedback**
- Displays nearby public issues ranked by relevance, prioritising proximity and approaching consultation deadlines.
- Allows users to filter issues by topic, such as parks, housing, and student life.
- Provides plain-language summaries and explanations of key government terms in the user's preferred language.
- Lets users speak to Spud, a friendly mascot, to express their opinions in their own language.
- Uses AI to translate and summarise feedback into a structured comment.
- Allows users to review and edit the original comment and its English version before submission.

**NFC and QR access**
- Allows users to transfer a selected issue and their feedback to the mobile app using NFC or a QR code.
- Enables users to save issues and begin tracking them on their own devices.
- Supports optional notifications and shareable content for platforms such as Instagram and messaging apps.
- Spud's official social media account publishes only verified council and community content, so residents can tell genuine posts from impersonators.

### 2.2 Mobile App

The mobile app supports residents before and after they submit feedback.

**AI-powered information assistant**
- Uses retrieval-augmented generation (RAG) to answer questions using official council documents and service information.
- Provides source references so users can verify the information.
- Directs users to an appropriate department or contact person when the system cannot provide a reliable answer.

**Issue progress tracker**

The app displays the progress of relevant local issues through three stages:

1. **Received** — The feedback or issue has been received.
2. **In Review** — The issue is being reviewed, referred to the relevant department, or considered by the council.
3. **Outcome** — The app displays the available decision, case or reference number where applicable, and reasons for rejection where provided.

The tracker communicates the status of the issue, rather than implying that an individual comment has been accepted or approved.

**Notifications and sharing**
- Sends optional updates when the status of a saved issue changes.
- Allows users to share relevant civic information through social media and messaging platforms.
- Helps residents stay informed without needing to repeatedly visit council websites.

**Badge collection**
- Each HearHere post a resident visits adds a badge to their collection in the app (e.g. a library, park or campus post).
- Badges give residents a light incentive to discover posts in different neighbourhoods and come back over time.
- Badges are stored only on the user's phone and are never ranked publicly.

### 2.3 Privacy-by-Design Trade-off

A key design decision concerns the tension between **R5 (trackable feedback)** and **R6 (clearing records after use)**.

To balance these requirements:

- The physical post does not retain users' personal records or voice recordings.
- Users choose whether to transfer an issue and their feedback to their own phones.
- Tracking begins only after users opt in through the app.
- Users can review the information they choose to submit and decide whether to provide identifying details.

This approach separates temporary interaction with the physical post from the user's decision to retain and track information.

## 3. Design Justification

HearHere is grounded in the findings from our fieldwork with international students and immigrant residents in Melbourne.

| Design decision | Fieldwork justification |
|---|---|
| Multilingual information and plain-language explanations | **Theme 1 — Language:** Translated materials do not always resolve difficulties with unfamiliar government terminology. Participant P8 highlighted the barriers that remain even when translated information exists. |
| Nearby issues ranked by relevance | **Theme 3 — Personal relevance:** Residents are more likely to participate when an issue is relevant to their lives and surroundings. |
| Voice-based feedback and a friendly mascot | **Themes 1 and 4 — Language and interaction:** Residents may struggle to find the correct terminology or identify whom to contact. Voice interaction offers an alternative way to express their views. |
| Physical information post | **Theme 5 — Accessibility of information:** Some newer residents rarely encounter mailed information or printed flyers. Participant P7 reported not knowing what events were taking place in Melbourne. |
| Mobile app, notifications, and sharing | **Themes 2 and 5 — Time and information channels:** Residents need convenient ways to participate and may rely on existing social media and messaging platforms to discover information. |
| Issue progress tracker | **Theme 4 — Interaction:** Residents may be uncertain whether their feedback has been received or taken seriously. Clear status information can make the process more transparent. |
| RAG-based question-and-answer assistant | **Themes 1 and 4 — Language and interaction:** Unclear council websites and unfamiliar service pathways can make it difficult to understand policies or find the appropriate contact. |
| Badge collection across posts | **Themes 2 and 3 — Time and personal relevance:** Participation was low when it felt like extra effort with little personal return. A light, private reward gives residents a reason to notice and revisit posts along routes they already walk. |
| Verified council and community content | **R7 — Trustworthiness:** Using verified sources helps residents distinguish reliable civic information from commercial or misleading content. |

Overall, HearHere combines a physical discovery point with a digital follow-up channel. This design responds to the barriers identified in our fieldwork while recognising that participation must be understandable, relevant, and transparent to be meaningful.

## 4. Ethical and Social Considerations

The main ethical concerns relate to privacy, the accuracy of AI-generated content, the interpretation of public feedback, and equitable access.

### 4.1 Privacy and Identity

Speaking aloud in public may make residents feel exposed, particularly when their language reveals aspects of their background. Residents who are uncertain about their rights or eligibility to participate may also feel less comfortable engaging.

**Mitigation:**
- Do not retain voice recordings on the physical post.
- Explain data collection and consent in the user's preferred language.
- Allow anonymous feedback where appropriate.
- Provide typed input as an alternative to speaking.
- Make the transfer of information to the mobile app optional.

### 4.2 AI Accuracy and Misrepresentation

Incorrect translations or overly confident summaries may change a resident's intended meaning or misrepresent a government policy.

**Mitigation:**
- Let users review and edit AI-generated comments before submission.
- Preserve the original comment alongside the translated version where consent and data-handling rules permit.
- Use official documents as sources for the RAG assistant.
- Provide source references and direct users to a human contact when the assistant is uncertain.

### 4.3 Misuse of the Feedback Channel

Organised groups may submit repeated comments, while malicious individuals could place fake QR or NFC stickers over official access points.

**Mitigation:**
- Apply reasonable submission rate limits.
- Display an official web address for verification.
- Publish through a single verified official account that posts only verified content, so fake accounts using the Spud mascot are easy to spot and report.
- Inspect the physical posts regularly.
- Distinguish repeated submissions from evidence of broader community consensus.
- Award a badge only once per post, and only after the user opens an issue, so badges cannot be farmed by repeated tapping.
- Keep the badge history on the device so it does not become a record of where someone has been.

### 4.4 Representation and Expectations

Self-selected feedback does not necessarily represent the views of the wider community. Residents may also misunderstand an issue's status as confirmation that their personal opinion has been accepted.

**Mitigation:**
- Label submissions as community feedback rather than votes or representative polling.
- Clearly distinguish the progress of a public issue from the status of an individual submission.
- Explain what each status means and avoid promising outcomes that the council cannot guarantee.
- Ensure the design does not imply that all residents' views will receive identical consideration in every decision-making process.

### 4.5 Accessibility and Trust

Residents without smartphones, people with limited digital confidence, and people with accessibility needs should not be excluded.

**Mitigation:**
- Keep essential information accessible directly on the physical post.
- Consider accessible screen heights, readable text, and audio or typed interaction options.
- Use verified council, library, and community sources for displayed content.
- Avoid commercial advertising in the primary civic information interface, since it could undermine trust.

Commercial sponsorship could be explored as a future funding option, but only if it does not compromise the credibility or independence of civic information.

## 5. Future Development and User Evaluation

The next stage would evaluate a low-fidelity prototype with both the people reached by our original fieldwork and those whose perspectives were underrepresented.

### 5.1 Prototype Development

Planned activities include:

- Creating a clickable mobile app prototype in Figma.
- Building a cardboard or other low-fidelity physical post.
- Testing the concept at two or three locations, such as a library entrance or a street near a university campus.
- Exploring a council-side dashboard that groups feedback by topic and responsible department.
- Expanding language coverage beyond the languages most represented in our interviews.

### 5.2 User Evaluation Plan

We would conduct task-based usability tests with think-aloud sessions involving approximately 5–8 participants across different language backgrounds, including international students and immigrant residents.

**Usability and discoverability**
- Can first-time users find a relevant local issue?
- Can they understand its summary and provide feedback in their preferred language?
- Can they identify the responsible department and locate the issue's progress?

**Comfort and public interaction**
- Are users comfortable speaking to the mascot in a public space?
- Do background noise and the presence of passers-by discourage participation?
- Would typed input or other interaction methods improve comfort?

**AI accuracy and understanding**
- How accurately does the system translate and summarise feedback, as assessed by bilingual reviewers?
- Do users trust the generated content and recognise when corrections are necessary?
- Do plain-language explanations improve understanding compared with original council wording?

**Privacy and consent**
- Do users understand when information is stored on their own devices?
- Do they understand that tracking is optional?
- Are they comfortable with the proposed anonymity and consent options?

**Council workflow and feasibility**
- Who would maintain the displayed information?
- How would feedback be assigned to the relevant department?
- Are the proposed progress stages consistent with actual council processes?

Our original fieldwork did not include council staff, so consultation with council representatives would be necessary before implementation.

**Sustained engagement**
- Does interest decline after the initial novelty wears off?
- Does the badge collection encourage meaningful participation, or only repeated tapping?
- Does it motivate both international students and longer-term immigrant residents?

If evaluation shows that badges drive superficial activity, they would be reduced to a simple record of visited posts.

## 6. Conclusion

HearHere aims to bridge the gap between discovering local government information and participating in civic decision-making. By combining a physical information post, multilingual AI assistance, optional mobile tracking, and transparent issue updates, the concept responds to barriers identified in our fieldwork.

Its success would depend not only on usability, but also on privacy, trustworthy information, accessible interaction, and realistic integration with council processes.

## 7. AI Use Statement

AI tools were used to support brainstorming and drafting. The group reviewed and edited the final wording and remains responsible for the design decisions and submitted work.
