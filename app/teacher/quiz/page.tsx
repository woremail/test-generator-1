"use client";
import { useState, useEffect, useCallback } from 'react';
import { db } from '@/firebase/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import Sidebar from '@/components/Sidebar';
import { v4 as uuidv4 } from 'uuid';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import dynamic from 'next/dynamic';

const docx = dynamic(() => import('docx'), { ssr: false });
const { saveAs } = dynamic(() => import('file-saver'), { ssr: false });

const shuffle = (array, seed) => {
  const seededRandom = seed
    ? (index) => {
        const x = Math.sin(index + parseInt(seed.replace(/\D/g, ''))) * 10000;
        return x - Math.floor(x);
      }
    : Math.random;
  return [...array].sort(() => seededRandom(array.length) - 0.5);
};

const toUrduNumber = (num) => {
  const urduNumerals = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().split('').map(digit => urduNumerals[parseInt(digit)] || digit).join('');
};

const QuizGeneration = () => {
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [questionTypes, setQuestionTypes] = useState({ multiple: true, truefalse: true, short: false, long: false, fillblanks: false });
  const [difficultyLevels, setDifficultyLevels] = useState({ Easy: true, Medium: true, Hard: false });
  const [totalQuestions, setTotalQuestions] = useState(20);
  const [timeLimit, setTimeLimit] = useState(30);
  const [scheduledStart, setScheduledStart] = useState('');
  const [scheduledEnd, setScheduledEnd] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizType, setQuizType] = useState('Weekly');
  const [isMarked, setIsMarked] = useState(true);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editedQuestions, setEditedQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [hasQuestionType, setHasQuestionType] = useState(false);
  const [randomSeed, setRandomSeed] = useState(uuidv4());

  const grades = ['1', '2', '3', '4', '5'];
  const subjects = ['English', 'Math', 'Urdu', 'Science', 'Computer'];
  const quizTypes = ['Weekly', 'Monthly', 'Half Yearly', 'Final Exam', 'Other'];
  const maxQuestions = 200;
  const maxTimeLimit = 300;
  const optionLabels = (isRTL) => isRTL ? ['ا', 'ب', 'ج', 'د', 'ھ', 'و'] : ['A', 'B', 'C', 'D', 'E', 'F'];

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'questions'));
        const questionList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHasQuestionType(questionList.some(q => q.type || q.questionType));
        setQuestions(questionList);
      } catch (error) {
        console.error('Fetch error:', error);
        alert('Failed to fetch questions: ' + error.message);
      }
    };
    fetchQuestions();
  }, []);

  const filterQuestions = useCallback(() => questions.filter(q => {
    const qGrade = q.grade || q.class || '';
    const qSubject = q.subject || '';
    const qType = (q.type || q.questionType || '').toLowerCase();
    const qDifficulty = q.difficulty || '';

    const gradeMatch = !selectedGrade || qGrade.toString().toLowerCase() === selectedGrade.toLowerCase();
    const subjectMatch = !selectedSubject || qSubject.toLowerCase() === selectedSubject.toLowerCase();
    const typeMatch = !hasQuestionType || questionTypes[qType === 'mcqs' || qType === 'multiple' ? 'multiple' : qType.replace('_', '')] || false;
    const difficultyMatch = !difficultyLevels[qDifficulty] && !difficultyLevels[qDifficulty.charAt(0).toUpperCase() + qDifficulty.slice(1).toLowerCase()] ? false : true;

    return gradeMatch && subjectMatch && typeMatch && difficultyMatch;
  }), [questions, selectedGrade, selectedSubject, questionTypes, difficultyLevels, hasQuestionType]);

  const getTotalAvailableQuestions = useCallback(() => filterQuestions().length, [filterQuestions]);

  const generateQuestions = useCallback(() => {
    const filtered = filterQuestions();
    if (!Object.values(difficultyLevels).some(Boolean) || (hasQuestionType && !Object.values(questionTypes).some(Boolean))) return [];

    const selectedTypes = Object.keys(questionTypes).filter(t => questionTypes[t]);
    const selectedDifficulties = Object.keys(difficultyLevels).filter(d => difficultyLevels[d]);
    let allQuestions = [];

    if (hasQuestionType) {
      selectedTypes.forEach(type => {
        selectedDifficulties.forEach(difficulty => {
          const bucket = filtered.filter(q => {
            const qType = (q.type || q.questionType || '').toLowerCase();
            return qType === type.toLowerCase() || (qType === 'mcqs' && type === 'multiple');
          });
          allQuestions = [...allQuestions, ...shuffle(bucket, randomSeed).slice(0, Math.floor(totalQuestions / (selectedTypes.length * selectedDifficulties.length)))];
        });
      });
    } else {
      selectedDifficulties.forEach(difficulty => {
        const bucket = filtered.filter(q => (q.difficulty || '').toLowerCase() === difficulty.toLowerCase());
        allQuestions = [...allQuestions, ...shuffle(bucket, randomSeed).slice(0, Math.floor(totalQuestions / selectedDifficulties.length))];
      });
    }

    const remaining = totalQuestions - allQuestions.length;
    if (remaining > 0) {
      allQuestions = [...allQuestions, ...shuffle(filtered.filter(q => !allQuestions.includes(q)), randomSeed).slice(0, remaining)];
    }

    return shuffle(allQuestions.slice(0, totalQuestions), randomSeed)
      .map((q, i) => {
        if (!q.questionText || !q.difficulty || !q.subject || !q.grade) return null;

        const qType = (q.type || q.questionType || '').toLowerCase() === 'mcqs' ? 'multiple' : (q.type || q.questionType || '').toLowerCase().replace('_', '');
        let options = qType === 'multiple' ? shuffle(q.options.map((opt, idx) => ({
          text: opt || `Option ${idx + 1}`,
          format: q.subject === 'Math' ? 'math' : 'text',
        })), randomSeed) : [];

        let answer = qType === 'multiple'
          ? { value: options.findIndex(opt => opt.text === q.correctAnswer), text: q.correctAnswer }
          : qType === 'truefalse'
          ? { value: q.correctAnswer?.toLowerCase() === 'true', text: q.correctAnswer }
          : qType === 'fillblanks'
          ? { value: Object.fromEntries(Object.entries(q.blanks || {}).map(([k, v]) => [k, v || []])), text: q.correctAnswer || '' }
          : { value: q.correctAnswer || '', text: q.correctAnswer || '' };

        if (qType === 'multiple' && (answer.value === -1 || !q.correctAnswer)) return null;

        return {
          id: i + 1,
          type: qType,
          grade: q.grade,
          subject: q.subject,
          difficulty: q.difficulty,
          slo: q.slo || '',
          marks: isMarked ? 1 : 0,
          question: { text: q.questionText, format: q.subject === 'Math' ? 'math' : 'text', isRTL: q.subject === 'Urdu' },
          options,
          answer,
          explanation: { text: q.explanation || '', format: 'text', isRTL: false },
        };
      })
      .filter(q => q !== null);
  }, [filterQuestions, totalQuestions, isMarked, randomSeed, questionTypes, difficultyLevels, hasQuestionType]);

  const validateQuizSettings = useCallback(() => {
    const errors = [];
    if (!selectedGrade || !selectedSubject) errors.push('Please select grade and subject');
    if (hasQuestionType && !Object.values(questionTypes).some(Boolean)) errors.push('Select at least one question type');
    if (!Object.values(difficultyLevels).some(Boolean)) errors.push('Select at least one difficulty level');
    if (totalQuestions < 1 || totalQuestions > maxQuestions) errors.push(`Total questions must be between 1 and ${maxQuestions}`);
    if (timeLimit < 1 || timeLimit > maxTimeLimit) errors.push(`Time limit must be between 1 and ${maxTimeLimit} minutes`);
    if (!scheduledStart || new Date(scheduledStart) < new Date()) errors.push('Scheduled start must be in the future');
    if (scheduledEnd && new Date(scheduledEnd) <= new Date(scheduledStart)) errors.push('Scheduled end must be after start');
    if (isMarked && editedQuestions.some(q => q.marks <= 0)) errors.push('All questions must have positive marks');
    return errors.length ? errors.join('\n') : '';
  }, [selectedGrade, selectedSubject, questionTypes, difficultyLevels, totalQuestions, timeLimit, scheduledStart, scheduledEnd, isMarked, editedQuestions]);

  const handleCreateQuiz = () => {
    const error = validateQuizSettings();
    if (error) {
      alert(error);
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmGenerateQuiz = async () => {
    if (!quizTitle || quizTitle.length > 120) {
      alert('Quiz title is required and must be under 120 characters');
      setRandomSeed(uuidv4());
      setEditedQuestions(generateQuestions());
      return;
    }

    const questions = generateQuestions();
    if (questions.length === 0) {
      const selectedTypes = Object.keys(questionTypes).filter(t => questionTypes[t]);
      const selectedDifficulties = Object.keys(difficultyLevels).filter(d => difficultyLevels[d]);
      alert(`No questions available for the selected criteria.\nGrade: ${selectedGrade}\nSubject: ${selectedSubject}\n${hasQuestionType ? `Question Types: ${selectedTypes.join(', ')}\n` : ''}Difficulties: ${selectedDifficulties.join(', ')}\nPlease check your database for matching questions.`);
      return;
    }

    const sanitizeObject = (obj) => {
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = value === undefined ? null : Array.isArray(value)
          ? value.map(item => item && typeof item === 'object' ? sanitizeObject(item) : item ?? null)
          : value && typeof value === 'object' ? sanitizeObject(value) : value ?? null;
      }
      return sanitized;
    };

    const quiz = sanitizeObject({
      title: quizTitle,
      quizType,
      class: selectedGrade,
      subject: selectedSubject,
      questionTypes: hasQuestionType ? Object.keys(questionTypes).filter(t => questionTypes[t]) : [],
      difficulties: Object.keys(difficultyLevels).filter(d => difficultyLevels[d]),
      isMarked,
      timeLimitMinutes: timeLimit,
      schedule: { startAt: new Date(scheduledStart), endAt: scheduledEnd ? new Date(scheduledEnd) : null },
      totalQuestions: questions.length,
      questionIds: questions.map(q => q.id),
      items: questions.map(q => ({
        questionId: q.id,
        questionType: q.type,
        subject: q.subject,
        difficulty: q.difficulty,
        slo: q.slo || '',
        question: q.question,
        options: q.options || [],
        answer: q.answer,
        explanation: q.explanation,
        marks: q.marks,
      })),
      totalMarks: isMarked ? questions.reduce((sum, q) => sum + q.marks, 0) : null,
      randomization: { seed: randomSeed, shuffledOrder: true, shuffleOptions: questions.some(q => q.type === 'multiple') },
      rendering: { respectRTL: selectedSubject === 'Urdu', renderMath: selectedSubject === 'Math' },
      status: 'draft',
      createdBy: 'current_user',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      version: 1,
      notes: null,
    });

    try {
      await addDoc(collection(db, 'quizzes'), quiz);
      setGeneratedQuiz(quiz);
      setEditedQuestions(quiz.items);
      setShowEditor(true);
      setShowConfirmModal(false);
      alert(`Quiz '${quizTitle}' created with ${questions.length} questions.`);
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert('Error saving quiz: ' + error.message);
    }
  };

  const handleEditQuestion = (index, field, value) => setEditedQuestions(prev => {
    const newQuestions = [...prev];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    return newQuestions;
  });

  const handleSaveChanges = async () => {
    if (!generatedQuiz) return;
    try {
      const sanitizedQuiz = {
        ...generatedQuiz,
        items: editedQuestions,
        totalMarks: isMarked ? editedQuestions.reduce((sum, q) => sum + q.marks, 0) : null,
        updatedAt: serverTimestamp(),
      };
      setGeneratedQuiz(sanitizedQuiz);
      alert('Quiz updated.');
    } catch (error) {
      alert('Error saving changes: ' + error.message);
    }
  };

  const handleReshuffle = () => {
    if (confirm('Reshuffling will change question selection, order, and MCQ option order. Continue?')) {
      setRandomSeed(uuidv4());
      setEditedQuestions(generateQuestions());
    }
  };

  const downloadQuizPDF = () => {
    if (!generatedQuiz) return;
    const pdfContent = `
      <!DOCTYPE html>
      <html dir="ltr">
      <head>
        <title>${generatedQuiz.title}</title>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu&display=swap" rel="stylesheet">
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; direction: ltr; }
          .header { border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
          .title { font-size: 28px; font-weight: bold; color: #1f2937; text-align: center; margin-bottom: 15px; }
          .header-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
          .header-table td { padding: 8px; font-size: 14px; color: #6b7280; vertical-align: top; }
          .header-table .label { font-weight: bold; width: 20%; }
          .header-table .value { width: 30%; }
          .name-field { border-bottom: 1px solid #6b7280; min-height: 20px; }
          .question { margin-bottom: 25px; page-break-inside: avoid; }
          .question-number { margin-bottom: 8px; overflow: hidden; }
          .question-number-urdu { font-family: 'Noto Nastaliq Urdu', sans-serif; direction: rtl; text-align: right; float: right; }
          .question-number-marks { font-family: Arial, sans-serif; direction: ltr; text-align: left; float: left; }
          .question-text { font-size: 16px; margin-bottom: 12px; font-weight: 500; }
          .options { margin-bottom: 10px; }
          .option { margin-bottom: 5px; font-size: 14px; }
          .urdu { font-family: 'Noto Nastaliq Urdu', sans-serif; direction: rtl; text-align: right; margin-right: 20px; }
          .page-break { page-break-before: always; }
          @media print { body { margin: 20px; } .page-break { page-break-before: always; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${generatedQuiz.title}</div>
          <table class="header-table">
            <tr>
              <td class="label">Name:</td>
              <td class="value name-field"></td>
              <td class="label">Class:</td>
              <td class="value">${generatedQuiz.class}</td>
            </tr>
            <tr>
              <td class="label">Subject:</td>
              <td class="value">${generatedQuiz.subject}</td>
              <td class="label">Duration:</td>
              <td class="value">${generatedQuiz.timeLimitMinutes} minutes</td>
            </tr>
            <tr>
              <td class="label">Date:</td>
              <td class="value">${new Date().toLocaleDateString()}</td>
              <td class="label">Total Questions:</td>
              <td class="value">${generatedQuiz.totalQuestions}</td>
            </tr>
            <tr>
              <td class="label">Total Marks:</td>
              <td class="value">${isMarked ? generatedQuiz.totalMarks : 'N/A'}</td>
              <td class="label"></td>
              <td class="value"></td>
            </tr>
          </table>
        </div>
        ${editedQuestions
          .map(
            (q, i) => `
              <div class="question">
                <div class="question-number">
                  <div class="${q.question.isRTL ? 'question-number-urdu' : ''}">
                    ${q.question.isRTL ? 'سوال ' + toUrduNumber(i + 1) : 'Question ' + (i + 1)}
                  </div>
                  ${isMarked ? `<div class="question-number-marks">(${q.marks} marks)</div>` : ''}
                </div>
                <div class="question-text ${q.question.isRTL ? 'urdu' : ''}">${q.question.format === 'math' ? '\\[' + q.question.text + '\\]' : q.question.text}</div>
                ${
                  q.type === 'multiple' && q.options?.length
                    ? `<div class="options ${q.question.isRTL ? 'urdu' : ''}">${q.options
                        .map(
                          (opt, j) =>
                            `<div class="option">${q.question.isRTL ? optionLabels(true)[j] : String.fromCharCode(65 + j)}. ${opt.format === 'math' ? '\\[' + opt.text + '\\]' : opt.text}</div>`
                        )
                        .join('')}</div>`
                    : q.type === 'truefalse'
                    ? `<div class="options ${q.question.isRTL ? 'urdu' : ''}"><div class="option">${q.question.isRTL ? 'صحیح یا غلط' : 'True or False'}</div></div>`
                    : q.type === 'fillblanks'
                    ? `<div class="options ${q.question.isRTL ? 'urdu' : ''}"><div class="option">${q.question.text.replace(/{blank\d+}|___/g, '________')}</div></div>`
                    : `<div class="options ${q.question.isRTL ? 'urdu' : ''}"><div class="option">${q.question.isRTL ? 'نیچے اپنا جواب لکھیں۔' : 'Write your answer below.'}</div></div>`
                }
              </div>
              ${(i + 1) % 5 === 0 && i < editedQuestions.length - 1 ? '<div class="page-break"></div>' : ''}
            `
          )
          .join('')}
      </body>
      </html>
    `;
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(pdfContent);
      newWindow.document.close();
      setTimeout(() => newWindow.print(), 1000);
      setTimeout(() => alert('Quiz PDF ready! Use print dialog to save as PDF.'), 1500);
    }
  };

  const downloadAnswerKey = () => {
    if (!generatedQuiz) return;
    const answerKeyContent = `
      <!DOCTYPE html>
      <html dir="ltr">
      <head>
        <title>${generatedQuiz.title} - Answer Key</title>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu&display=swap" rel="stylesheet">
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; direction: ltr; }
          .header { border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
          .title { font-size: 28px; font-weight: bold; color: #1f2937; margin-bottom: 10px; }
          .info { font-size: 14px; color: #6b7280; margin-bottom: 5px; }
          .answer { margin-bottom: 20px; }
          .answer-number { margin-bottom: 8px; overflow: hidden; }
          .answer-number-urdu { font-family: 'Noto Nastaliq Urdu', sans-serif; direction: rtl; text-align: right; float: right; }
          .answer-number-marks { font-family: Arial, sans-serif; direction: ltr; text-align: left; float: left; }
          .answer-text { font-size: 16px; margin-bottom: 12px; }
          .urdu { font-family: 'Noto Nastaliq Urdu', sans-serif; direction: rtl; text-align: right; }
          @media print { body { margin: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${generatedQuiz.title} - Answer Key</div>
          <div class="info"><strong>Grade:</strong> ${generatedQuiz.class}</div>
          <div class="info"><strong>Subject:</strong> ${generatedQuiz.subject}</div>
          <div class="info"><strong>Generated:</strong> ${new Date().toLocaleString()}</div>
          <div class="info"><strong>Total Questions:</strong> ${generatedQuiz.totalQuestions}</div>
        </div>
        ${editedQuestions
          .map(
            (q, i) => `
              <div class="answer">
                <div class="answer-number">
                  <div class="${q.question.isRTL ? 'answer-number-urdu' : ''}">
                    ${q.question.isRTL ? 'سوال ' + toUrduNumber(i + 1) : 'Question ' + (i + 1)}
                  </div>
                  ${isMarked ? `<div class="answer-number-marks">(${q.marks} marks)</div>` : ''}
                </div>
                <div class="answer-text ${q.question.isRTL ? 'urdu' : ''}">${q.question.format === 'math' ? '\\[' + q.question.text + '\\]' : q.question.text}</div>
                <div class="answer-text"><strong>Answer:</strong> ${
                  q.type === 'multiple' && q.options?.length
                    ? `${q.question.isRTL ? optionLabels(true)[q.answer.value] : String.fromCharCode(65 + q.answer.value)}. ${q.options[q.answer.value]?.text || q.answer.text}`
                    : q.type === 'truefalse'
                    ? q.question.isRTL
                      ? q.answer.value
                        ? 'صحیح'
                        : 'غلط'
                      : q.answer.value
                      ? 'True'
                      : 'False'
                    : q.type === 'fillblanks'
                    ? Object.entries(q.answer.value)
                        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(q.question.isRTL ? ' یا ' : ' or ') : v}`)
                        .join(', ')
                    : q.answer.text || q.answer.value
                }</div>
              </div>
            `
          )
          .join('')}
      </body>
      </html>
    `;
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(answerKeyContent);
      newWindow.document.close();
      setTimeout(() => newWindow.print(), 1000);
      setTimeout(() => alert('Answer Key ready! Use print dialog to save as PDF.'), 1500);
    }
  };

  const downloadQuizWord = async () => {
    if (!generatedQuiz) return;
    try {
      const docxModule = await docx;
      const { Document, Packer, Paragraph, TextRun, Header, Footer } = docxModule;
      const AlignmentType = docxModule.AlignmentType || {};

      const doc = new Document({
        sections: [{
          properties: { page: { margin: { top: 720, bottom: 720, left: 720, right: 720 } } },
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: generatedQuiz.title, size: 32, font: 'Arial', bold: true })],
                  alignment: AlignmentType.LEFT || 'left',
                  spacing: { after: 200 },
                }),
              ],
            }),
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: `Generated: ${new Date().toLocaleString()}`, size: 20, font: 'Arial' })],
                  alignment: AlignmentType.CENTER || 'center',
                  spacing: { before: 200 },
                }),
              ],
            }),
          },
          children: [
            new Paragraph({
              children: [new TextRun({ text: `Grade: ${generatedQuiz.class}`, size: 24, font: 'Arial' })],
              alignment: AlignmentType.LEFT || 'left',
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [new TextRun({ text: `Subject: ${generatedQuiz.subject}`, size: 24, font: 'Arial' })],
              alignment: AlignmentType.LEFT || 'left',
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [new TextRun({ text: `Total Questions: ${generatedQuiz.totalQuestions}`, size: 24, font: 'Arial' })],
              alignment: AlignmentType.LEFT || 'left',
              spacing: { after: 100 },
            }),
            ...(isMarked
              ? [
                  new Paragraph({
                    children: [new TextRun({ text: `Total Marks: ${generatedQuiz.totalMarks}`, size: 24, font: 'Arial' })],
                    alignment: AlignmentType.LEFT || 'left',
                    spacing: { after: 200 },
                  }),
                ]
              : []),
            ...editedQuestions.flatMap((q, i) => [
              new Paragraph({
                children: [
                  new TextRun({ 
                    text: q.question.isRTL ? `سوال ${toUrduNumber(i + 1)}` : `Question ${i + 1}`, 
                    size: 24, 
                    font: q.question.isRTL ? 'Noto Nastaliq Urdu' : 'Arial',
                    bold: true 
                  }),
                  ...(isMarked ? [new TextRun({ 
                    text: ` (${q.marks} marks)`, 
                    size: 24, 
                    font: 'Arial',
                    bold: true 
                  })] : []),
                ],
                heading: 'Heading2',
                alignment: q.question.isRTL ? (AlignmentType.RIGHT || 'right') : (AlignmentType.LEFT || 'left'),
                spacing: { before: 200, after: 100 },
              }),
              new Paragraph({
                children: [new TextRun({ text: q.question.text, size: 24, font: q.question.isRTL ? 'Noto Nastaliq Urdu' : 'Arial' })],
                alignment: q.question.isRTL ? (AlignmentType.RIGHT || 'right') : (AlignmentType.LEFT || 'left'),
                spacing: { after: 100 },
              }),
              ...(q.type === 'multiple' && q.options?.length
                ? q.options.map((opt, j) => ({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ 
                          text: `${q.question.isRTL ? optionLabels(true)[j] : String.fromCharCode(65 + j)}. ${opt.text}`, 
                          size: 24, 
                          font: q.question.isRTL ? 'Noto Nastaliq Urdu' : 'Arial' 
                        })],
                        alignment: q.question.isRTL ? (AlignmentType.RIGHT || 'right') : (AlignmentType.LEFT || 'left'),
                        spacing: { after: 50 },
                      }),
                    ],
                  }))
                : q.type === 'truefalse'
                ? [
                    new Paragraph({
                      children: [new TextRun({ 
                        text: q.question.isRTL ? 'صحیح یا غلط' : 'True or False', 
                        size: 24, 
                        font: q.question.isRTL ? 'Noto Nastaliq Urdu' : 'Arial' 
                      })],
                      alignment: q.question.isRTL ? (AlignmentType.RIGHT || 'right') : (AlignmentType.LEFT || 'left'),
                      spacing: { after: 50 },
                    }),
                  ]
                : q.type === 'fillblanks'
                ? [
                    new Paragraph({
                      children: [new TextRun({ 
                        text: q.question.text.replace(/{blank\d+}|___/g, '________'), 
                        size: 24, 
                        font: q.question.isRTL ? 'Noto Nastaliq Urdu' : 'Arial' 
                      })],
                      alignment: q.question.isRTL ? (AlignmentType.RIGHT || 'right') : (AlignmentType.LEFT || 'left'),
                      spacing: { after: 50 },
                    }),
                  ]
                : [
                    new Paragraph({
                      children: [new TextRun({ 
                        text: q.question.isRTL ? 'نیچے اپنا جواب لکھیں۔' : 'Write your answer below.', 
                        size: 24, 
                        font: q.question.isRTL ? 'Noto Nastaliq Urdu' : 'Arial' 
                      })],
                      alignment: q.question.isRTL ? (AlignmentType.RIGHT || 'right') : (AlignmentType.LEFT || 'left'),
                      spacing: { after: 50 },
                    }),
                  ]),
              ...(i < editedQuestions.length - 1 && (i + 1) % 5 === 0 ? [{ children: [new Paragraph({ pageBreakBefore: true })] }] : []),
            ]).flat(),
          ],
        }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${generatedQuiz.title}.docx`);
      alert('Quiz Word document downloaded!');
    } catch (error) {
      console.error('Error generating Word document:', error);
      alert('Error generating Word document: ' + error.message);
    }
  };

  const mathJaxConfig = {
    tex: { inlineMath: [['$', '$'], ['\\(', '\\)']], displayMath: [['$$', '$$'], ['\\[', '\\]']] },
    options: { renderActions: { find: [10, () => {}, () => {}] } },
  };

  return (
    <MathJaxContext config={mathJaxConfig}>
      <div className="flex h-screen bg-gray-50">
        <Sidebar userRole="Teacher" currentPage="quiz" />
        <div className="flex-1 overflow-auto p-8 ml-[256px]">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate Quiz</h1>
            <p className="text-gray-600">Create randomized quizzes for your students</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                    <select
                      value={selectedGrade}
                      onChange={e => {
                        setSelectedGrade(e.target.value);
                        setSelectedSubject('');
                      }}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a grade</option>
                      {grades.map(grade => (
                        <option key={grade} value={grade}>
                          Grade {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedGrade && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <select
                        value={selectedSubject}
                        onChange={e => setSelectedSubject(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select a subject</option>
                        {subjects.map(subject => (
                          <option key={subject} value={subject}>
                            {subject}
                        </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedSubject && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Question Types</label>
                        <div className="space-y-2">
                          {Object.keys(questionTypes).map(type => (
                            <label key={type} className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={questionTypes[type]}
                                onChange={() => setQuestionTypes(prev => ({ ...prev, [type]: !prev[type] }))}
                                className="mr-3"
                              />
                              <span className="text-sm text-gray-700">
                                {type === 'multiple' ? 'Multiple Choice (MCQs)' : type.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Difficulty Levels</label>
                        <div className="space-y-2">
                          {Object.keys(difficultyLevels).map(level => (
                            <label key={level} className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={difficultyLevels[level]}
                                onChange={() => setDifficultyLevels(prev => ({ ...prev, [level]: !prev[level] }))}
                                className="mr-3"
                              />
                              <span className="text-sm text-gray-700">{level}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Total Questions</label>
                        <input
                          type="number"
                          value={totalQuestions}
                          onChange={e => setTotalQuestions(Math.min(parseInt(e.target.value) || 1, maxQuestions))}
                          min="1"
                          max={maxQuestions}
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Max: {getTotalAvailableQuestions()} available</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {selectedSubject && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
                      <input
                        type="number"
                        value={timeLimit}
                        onChange={e => setTimeLimit(parseInt(e.target.value) || 1)}
                        min="1"
                        max={maxTimeLimit}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Start</label>
                      <input
                        type="datetime-local"
                        value={scheduledStart}
                        onChange={e => setScheduledStart(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled End (Optional)</label>
                      <input
                        type="datetime-local"
                        value={scheduledEnd}
                        onChange={e => setScheduledEnd(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Grade:</span>
                    <span className="font-medium text-gray-900">{selectedGrade || 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subject:</span>
                    <span className="font-medium text-gray-900">{selectedSubject || 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Questions:</span>
                    <span className="font-medium text-gray-900">{totalQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available:</span>
                    <span className="font-medium text-gray-900">{getTotalAvailableQuestions()}</span>
                  </div>
                </div>
                <button
                  onClick={handleCreateQuiz}
                  disabled={!selectedGrade || !selectedSubject || (hasQuestionType && !Object.values(questionTypes).some(Boolean)) || !Object.values(difficultyLevels).some(Boolean)}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  <i className="ri-file-list-3-line mr-2"></i>Create Quiz
                </button>
              </div>
            </div>
          </div>
          {showConfirmModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Quiz</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title</label>
                    <input
                      type="text"
                      value={quizTitle}
                      onChange={e => setQuizTitle(e.target.value)}
                      maxLength={120}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Type</label>
                    <select
                      value={quizType}
                      onChange={e => setQuizType(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      {quizTypes.map(type => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Mode</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={isMarked}
                          onChange={() => setIsMarked(true)}
                          className="mr-2"
                        />
                        <span>Marked</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={!isMarked}
                          onChange={() => setIsMarked(false)}
                          className="mr-2"
                        />
                        <span>Unmarked</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmGenerateQuiz}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Confirm & Generate
                  </button>
                </div>
              </div>
            </div>
          )}
          {showEditor && generatedQuiz && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">Quiz Paper Editor</h3>
                    <button
                      onClick={() => setShowEditor(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <i className="ri-close-line text-2xl"></i>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold">Total Marks: {isMarked ? editedQuestions.reduce((sum, q) => sum + q.marks, 0) : 'N/A'}</h4>
                  </div>
                  {editedQuestions.map((q, index) => (
                    <div key={index} className="mb-4 p-4 border rounded-lg">
                      <div className="flex justify-between">
                        <h5 className={`font-medium ${q.question.isRTL ? 'text-right font-noto-nastaliq' : ''}`}>
                          Question {index + 1} ({q.type})
                        </h5>
                        {isMarked && (
                          <input
                            type="number"
                            value={q.marks}
                            onChange={e => handleEditQuestion(index, 'marks', parseFloat(e.target.value) || 1)}
                            min="0"
                            step="0.5"
                            className="w-20 px-2 py-1 border rounded"
                          />
                        )}
                      </div>
                      <MathJax dynamic>
                        <textarea
                          value={q.question.text}
                          onChange={e => handleEditQuestion(index, 'question', { ...q.question, text: e.target.value })}
                          className={`w-full p-2 border rounded mt-2 ${q.question.isRTL ? 'text-right font-noto-nastaliq' : ''}`}
                          dir={q.question.isRTL ? 'rtl' : 'ltr'}
                        />
                        {q.type === 'multiple' && q.options?.length > 0 ? (
                          <div className="mt-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Options:</label>
                            {q.options.map((opt, i) => (
                              <div key={i} className={`flex items-center space-x-2 mb-2 ${q.question.isRTL ? 'space-x-reverse' : ''}`}>
                                <span className={q.question.isRTL ? 'font-noto-nastaliq' : ''}>{q.question.isRTL ? optionLabels(true)[i] : String.fromCharCode(65 + i)}.</span>
                                <input
                                  value={opt.text}
                                  onChange={e => {
                                    const newOptions = [...q.options];
                                    newOptions[i] = { ...newOptions[i], text: e.target.value };
                                    handleEditQuestion(index, 'options', newOptions);
                                  }}
                                  className={`flex-1 p-2 border rounded ${q.question.isRTL ? 'text-right font-noto-nastaliq' : ''}`}
                                  dir={q.question.isRTL ? 'rtl' : 'ltr'}
                                />
                                <input
                                  type="radio"
                                  checked={q.answer.value === i}
                                  onChange={() =>
                                    handleEditQuestion(index, 'answer', { ...q.answer, value: i, text: q.options[i].text })
                                  }
                                  className={q.question.isRTL ? 'mr-2' : 'ml-2'}
                                />
                              </div>
                            ))}
                          </div>
                        ) : q.type === 'truefalse' ? (
                          <div className={`mt-2 ${q.question.isRTL ? 'text-right font-noto-nastaliq' : ''}`}>
                            <label className={q.question.isRTL ? 'ml-4' : 'mr-4'}>
                              <input
                                type="radio"
                                checked={q.answer.value === true}
                                onChange={() =>
                                  handleEditQuestion(index, 'answer', { ...q.answer, value: true, text: q.question.isRTL ? 'صحیح' : 'True' })
                                }
                                className={q.question.isRTL ? 'ml-2' : 'mr-2'}
                              />
                              <span className={q.question.isRTL ? 'font-noto-nastaliq' : ''}>{q.question.isRTL ? 'صحیح' : 'True'}</span>
                            </label>
                            <label>
                              <input
                                type="radio"
                                checked={q.answer.value === false}
                                onChange={() =>
                                  handleEditQuestion(index, 'answer', { ...q.answer, value: false, text: q.question.isRTL ? 'غلط' : 'False' })
                                }
                                className={q.question.isRTL ? 'ml-2' : 'mr-2'}
                              />
                              <span className={q.question.isRTL ? 'font-noto-nastaliq' : ''}>{q.question.isRTL ? 'غلط' : 'False'}</span>
                            </label>
                          </div>
                        ) : (
                          <textarea
                            value={q.type === 'fillblanks' ? JSON.stringify(q.answer.value, null, 2) : q.answer.text}
                            onChange={e =>
                              handleEditQuestion(index, 'answer', {
                                ...q.answer,
                                value: q.type === 'fillblanks' ? JSON.parse(e.target.value || '{}') : e.target.value,
                                text: e.target.value,
                              })
                            }
                            className={`w-full p-2 border rounded mt-2 ${q.question.isRTL ? 'text-right font-noto-nastaliq' : ''}`}
                            dir={q.question.isRTL ? 'rtl' : 'ltr'}
                          />
                        )}
                        <textarea
                          value={q.explanation.text}
                          onChange={e => handleEditQuestion(index, 'explanation', { ...q.explanation, text: e.target.value })}
                          className="w-full p-2 border rounded mt-2"
                          placeholder="Explanation (optional)"
                        />
                      </MathJax>
                    </div>
                  ))}
                  <div className="flex space-x-4">
                    <button
                      onClick={handleSaveChanges}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={downloadQuizPDF}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg"
                    >
                      Download PDF
                    </button>
                    <button
                      onClick={downloadAnswerKey}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg"
                    >
                      Download Answer Key
                    </button>
                    <button
                      onClick={downloadQuizWord}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg"
                    >
                      Download Word
                    </button>
                    <button
                      onClick={handleReshuffle}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg"
                    >
                      Reshuffle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MathJaxContext>
  );
};

export default QuizGeneration;