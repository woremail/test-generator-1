'use client';

import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import * as XLSX from 'xlsx';
import Sidebar from '@/components/Sidebar';
import 'katex/dist/katex.min.css';
import katex from 'katex';

const QuestionCreator = () => {
  const [mode, setMode] = useState('individual');
  const [formData, setFormData] = useState({
    type: 'multiple',
    grade: '',
    subject: '',
    book: '',
    chapter: '',
    topic: '',
    difficulty: 'Easy',
    slo: '',
    questionText: '',
    mathFormula: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    blanks: {},
  });
  const [csvData, setCsvData] = useState([]);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const grades = [1, 2, 3, 4, 5];
  const subjectsByGrade = {
    1: ['English', 'Math', 'Urdu', 'Science'],
    2: ['English', 'Math', 'Urdu', 'Science'],
    3: ['English', 'Math', 'Urdu', 'Science', 'Computer'],
    4: ['English', 'Math', 'Urdu', 'Science', 'Computer'],
    5: ['English', 'Math', 'Urdu', 'Science', 'Computer'],
  };
  const booksBySubject = {
    English: ['English Textbook A', 'English Textbook B'],
    Math: ['Math Textbook A', 'Math Textbook B'],
    Urdu: ['Urdu Textbook A', 'Urdu Textbook B'],
    Science: ['Science Textbook A', 'Science Textbook B'],
    Computer: ['Computer Textbook A', 'Computer Textbook B'],
  };
  const chaptersByBook = {
    'English Textbook A': ['Chapter 1: Basics', 'Chapter 2: Grammar', 'Chapter 3: Literature'],
    'English Textbook B': ['Chapter 1: Reading', 'Chapter 2: Writing'],
    'Math Textbook A': ['Chapter 1: Numbers', 'Chapter 2: Algebra', 'Chapter 3: Geometry'],
    'Math Textbook B': ['Chapter 1: Arithmetic', 'Chapter 2: Equations'],
    'Urdu Textbook A': ['Chapter 1: Poetry', 'Chapter 2: Prose'],
    'Urdu Textbook B': ['Chapter 1: Grammar', 'Chapter 2: Composition'],
    'Science Textbook A': ['Chapter 1: Physics', 'Chapter 2: Chemistry'],
    'Science Textbook B': ['Chapter 1: Biology', 'Chapter 2: Earth Science'],
    'Computer Textbook A': ['Chapter 1: Basics', 'Chapter 2: Programming'],
    'Computer Textbook B': ['Chapter 1: Hardware', 'Chapter 2: Software'],
  };
  const topicsByChapter = {
    'Chapter 1: Basics': ['Topic 1: Introduction', 'Topic 2: Fundamentals'],
    'Chapter 2: Grammar': ['Topic 1: Nouns', 'Topic 2: Verbs'],
    'Chapter 3: Literature': ['Topic 1: Poetry', 'Topic 2: Prose'],
    'Chapter 1: Reading': ['Topic 1: Comprehension', 'Topic 2: Vocabulary'],
    'Chapter 2: Writing': ['Topic 1: Essays', 'Topic 2: Letters'],
    'Chapter 1: Numbers': ['Topic 1: Addition', 'Topic 2: Subtraction'],
    'Chapter 2: Algebra': ['Topic 1: Equations', 'Topic 2: Inequalities'],
    'Chapter 3: Geometry': ['Topic 1: Shapes', 'Topic 2: Angles'],
    'Chapter 1: Arithmetic': ['Topic 1: Multiplication', 'Topic 2: Division'],
    'Chapter 2: Equations': ['Topic 1: Linear Equations', 'Topic 2: Quadratic Equations'],
    'Chapter 1: Poetry': ['Topic 1: Nazm', 'Topic 2: Ghazal'],
    'Chapter 2: Prose': ['Topic 1: Stories', 'Topic 2: Essays'],
    'Chapter 1: Grammar': ['Topic 1: Syntax', 'Topic 2: Morphology'],
    'Chapter 2: Composition': ['Topic 1: Writing Skills', 'Topic 2: Creative Writing'],
    'Chapter 1: Physics': ['Topic 1: Motion', 'Topic 2: Forces'],
    'Chapter 2: Chemistry': ['Topic 1: Elements', 'Topic 2: Reactions'],
    'Chapter 1: Biology': ['Topic 1: Cells', 'Topic 2: Organisms'],
    'Chapter 2: Earth Science': ['Topic 1: Rocks', 'Topic 2: Weather'],
    'Chapter 1: Basics': ['Topic 1: Computer Parts', 'Topic 2: Operating Systems'],
    'Chapter 2: Programming': ['Topic 1: Python', 'Topic 2: JavaScript'],
    'Chapter 1: Hardware': ['Topic 1: CPU', 'Topic 2: Memory'],
    'Chapter 2: Software': ['Topic 1: Applications', 'Topic 2: Systems'],
  };

  useEffect(() => {
    localStorage.setItem('questionDraft', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    const draft = localStorage.getItem('questionDraft');
    if (draft) {
      setFormData(JSON.parse(draft));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };
      if (name === 'grade') {
        return { ...newFormData, subject: '', book: '', chapter: '', topic: '', type: 'multiple', slo: '', questionText: '', mathFormula: '', options: ['', '', '', ''], correctAnswer: '', explanation: '', blanks: {} };
      }
      if (name === 'subject') {
        return { ...newFormData, book: '', chapter: '', topic: '', type: 'multiple', slo: '', questionText: '', mathFormula: '', options: ['', '', '', ''], correctAnswer: '', explanation: '', blanks: {} };
      }
      if (name === 'book') {
        return { ...newFormData, chapter: '', topic: '', type: 'multiple', slo: '', questionText: '', mathFormula: '', options: ['', '', '', ''], correctAnswer: '', explanation: '', blanks: {} };
      }
      if (name === 'chapter') {
        return { ...newFormData, topic: '', type: 'multiple', slo: '', questionText: '', mathFormula: '', options: ['', '', '', ''], correctAnswer: '', explanation: '', blanks: {} };
      }
      if (name === 'topic') {
        return { ...newFormData, type: 'multiple', slo: '', questionText: '', mathFormula: '', options: ['', '', '', ''], correctAnswer: '', explanation: '', blanks: {} };
      }
      if (name === 'type') {
        return { ...newFormData, questionText: '', mathFormula: '', options: ['', '', '', ''], correctAnswer: '', explanation: '', blanks: {} };
      }
      return newFormData;
    });
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData((prev) => ({ ...prev, options: newOptions }));
    setErrors((prev) => ({ ...prev, [`option${index}`]: '' }));
  };

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData((prev) => ({ ...prev, options: [...prev.options, ''] }));
    }
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        options: newOptions,
        correctAnswer: newOptions.includes(prev.correctAnswer) ? prev.correctAnswer : '',
      }));
    }
  };

  const handleBlankChange = (blankId, value) => {
    setFormData((prev) => ({
      ...prev,
      blanks: { ...prev.blanks, [blankId]: value.split('|').filter(Boolean) },
    }));
    setErrors((prev) => ({ ...prev, [blankId]: '' }));
  };

  const addBlank = () => {
    const newBlankId = `blank${Object.keys(formData.blanks).length + 1}`;
    setFormData((prev) => ({
      ...prev,
      blanks: { ...prev.blanks, [newBlankId]: [] },
    }));
  };

  const removeBlank = (blankId) => {
    const newBlanks = { ...formData.blanks };
    delete newBlanks[blankId];
    setFormData((prev) => ({ ...prev, blanks: newBlanks }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.grade) newErrors.grade = 'Class is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.book) newErrors.book = 'Book is required';
    if (!formData.chapter) newErrors.chapter = 'Chapter is required';
    if (!formData.topic) newErrors.topic = 'Topic is required';
    if (!formData.type) newErrors.type = 'Question type is required';
    if (!formData.difficulty) newErrors.difficulty = 'Difficulty is required';
    if (!formData.slo) newErrors.slo = 'SLO is required';
    if (!formData.questionText) newErrors.questionText = 'Question text is required';
    if (formData.subject === 'Math' && formData.mathFormula) {
      try {
        katex.renderToString(formData.mathFormula);
      } catch (e) {
        newErrors.mathFormula = 'Invalid LaTeX syntax';
      }
    }
    if (formData.type === 'multiple') {
      if (formData.options.filter((opt) => opt.trim()).length < 2) {
        newErrors.options = 'At least 2 non-empty options required';
      }
      if (!formData.correctAnswer || !formData.options.includes(formData.correctAnswer)) {
        newErrors.correctAnswer = 'Valid correct answer required';
      }
    }
    if (formData.type === 'truefalse' && !['true', 'false'].includes(formData.correctAnswer)) {
      newErrors.correctAnswer = 'True or False required';
    }
    if (['short', 'long'].includes(formData.type) && !formData.correctAnswer) {
      newErrors.correctAnswer = 'Correct answer required';
    }
    if (formData.type === 'fillblanks') {
      const blanksCount = (formData.questionText.match(/{blank\d+}|___/g) || []).length;
      if (Object.keys(formData.blanks).length !== blanksCount) {
        newErrors.blanks = 'Number of answers must match blanks in question';
      }
      Object.keys(formData.blanks).forEach((blankId) => {
        if (!formData.blanks[blankId].length) {
          newErrors[blankId] = `Answers for ${blankId} required`;
        }
      });
    }
    if (formData.questionText.length > 2000) {
      newErrors.questionText = 'Question text must be ≤ 2000 characters';
    }
    if (formData.explanation.length > 4000) {
      newErrors.explanation = 'Explanation must be ≤ 4000 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setToast({ type: 'error', message: 'Please fix form errors' });
      return;
    }
    setToast({ type: 'info', message: 'Submitting question...' });
    try {
      const questionsRef = collection(db, 'questions');
      const question = {
        ...formData,
        language: formData.subject === 'Urdu' ? 'ur' : 'en',
        createdBy: 'current_user_id',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await addDoc(questionsRef, question);
      setToast({ type: 'success', message: 'Question submitted successfully!' });
      handleReset();
    } catch (error) {
      setToast({ type: 'error', message: `Failed to submit question: ${error.message}` });
    }
  };

  const handleReset = () => {
    setFormData({
      type: 'multiple',
      grade: '',
      subject: '',
      book: '',
      chapter: '',
      topic: '',
      difficulty: 'Easy',
      slo: '',
      questionText: '',
      mathFormula: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      blanks: {},
    });
    setErrors({});
    setToast({ type: 'info', message: 'Form reset' });
  };

  const handleFileUpload = (e) => {
    if (!formData.grade || !formData.subject) {
      setToast({ type: 'error', message: 'Please select Class and Subject before uploading' });
      return;
    }
    const file = e.target.files[0];
    if (!file) return;
    setToast({ type: 'info', message: `Processing file for Class ${formData.grade} ${formData.subject}...` });
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      const validatedData = jsonData.map((row, index) => {
        const errors = [];
        if (!['MCQS', 'TRUE_FALSE', 'SHORT_ANSWER', 'LONG_ANSWER', 'FILL_BLANKS'].includes(row.questionType)) {
          errors.push('Invalid question type');
        }
        if (row.class && row.class !== formData.grade) {
          errors.push(`Class must be ${formData.grade}`);
        }
        if (row.subject && row.subject !== formData.subject) {
          errors.push(`Subject must be ${formData.subject}`);
        }
        if (!['Easy', 'Medium', 'Hard'].includes(row.difficulty)) {
          errors.push('Invalid difficulty');
        }
        if (!row.slo) errors.push('SLO required');
        if (!row.question) errors.push('Question text required');
        if (row.questionType === 'MCQS') {
          const options = [row.optionا, row.optionب, row.optionج, row.optionد, row.optionھ, row.optionو].filter(Boolean);
          if (options.length < 2) errors.push('At least 2 options required');
          const validOptions = formData.subject === 'Urdu' ? ['ا', 'ب', 'ج', 'د', 'ھ', 'و'] : ['A', 'B', 'C', 'D', 'E', 'F'];
          if (!validOptions.includes(row.correctOption)) {
            errors.push('Invalid correct option');
          }
        }
        if (row.questionType === 'TRUE_FALSE' && !['True', 'False'].includes(row.correctTF)) {
          errors.push('True or False required');
        }
        if (['SHORT_ANSWER', 'LONG_ANSWER'].includes(row.questionType) && !row.correctAnswer) {
          errors.push('Correct answer required');
        }
        if (row.questionType === 'FILL_BLANKS') {
          const blanksCount = (row.question.match(/{blank\d+}|___/g) || []).length;
          const blankAnswers = Object.keys(row)
            .filter((key) => key.startsWith('answers_blank'))
            .map((key) => ({ id: key.replace('answers_', ''), answers: row[key]?.split('|').filter(Boolean) || [] }));
          if (blankAnswers.length !== blanksCount) {
            errors.push('Number of answers must match blanks');
          }
          blankAnswers.forEach((blank) => {
            if (!blank.answers.length) {
              errors.push(`Answers for ${blank.id} required`);
            }
          });
        }
        return { row, errors, index };
      });
      setCsvData(validatedData);
      setToast({
        type: 'info',
        message: `Processed ${validatedData.length} rows for Class ${formData.grade} ${formData.subject}, ${validatedData.filter((d) => d.errors.length === 0).length} valid`,
      });
    };
    reader.readAsArrayBuffer(file);
  };

  const uploadBulk = async () => {
    setToast({ type: 'info', message: `Uploading questions for Class ${formData.grade} ${formData.subject}...` });
    const questionsRef = collection(db, 'questions');
    let inserted = 0;
    for (const { row } of csvData.filter((d) => d.errors.length === 0)) {
      let correctAnswer = '';
      let options = [];
      let blanks = {};
      if (row.questionType === 'MCQS') {
        options = [row.optionا, row.optionب, row.optionج, row.optionد, row.optionھ, row.optionو].filter(Boolean);
        const optionLabels = formData.subject === 'Urdu' ? ['ا', 'ب', 'ج', 'د', 'ھ', 'و'] : ['A', 'B', 'C', 'D', 'E', 'F'];
        correctAnswer = options[optionLabels.indexOf(row.correctOption)];
      } else if (row.questionType === 'TRUE_FALSE') {
        correctAnswer = row.correctTF.toLowerCase();
      } else if (['SHORT_ANSWER', 'LONG_ANSWER'].includes(row.questionType)) {
        correctAnswer = row.correctAnswer;
      } else if (row.questionType === 'FILL_BLANKS') {
        blanks = Object.keys(row)
          .filter((key) => key.startsWith('answers_blank'))
          .reduce((acc, key) => {
            const blankId = key.replace('answers_', '');
            acc[blankId] = row[key]?.split('|').filter(Boolean) || [];
            return acc;
          }, {});
        correctAnswer = blanks;
      }
      const question = {
        questionType: row.questionType.toLowerCase().replace('_', ''),
        grade: formData.grade,
        subject: formData.subject,
        difficulty: row.difficulty || 'Easy',
        slo: row.slo,
        questionText: row.question,
        options,
        correctAnswer,
        blanks,
        explanation: row.explanation || '',
        language: formData.subject === 'Urdu' ? 'ur' : 'en',
        createdBy: 'current_user_id',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      try {
        await addDoc(questionsRef, question);
        inserted++;
      } catch (error) {
        setToast({ type: 'error', message: `Failed to upload row ${row}: ${error.message}` });
        return;
      }
    }
    setToast({ type: 'success', message: `Uploaded ${inserted} questions successfully for Class ${formData.grade} ${formData.subject}!` });
    setCsvData([]);
    handleReset();
  };

  const renderPreview = () => {
    if (!formData.questionText) return null;
    let previewContent = formData.questionText;
    if (formData.subject === 'Math' && formData.mathFormula) {
      try {
        previewContent = katex.renderToString(formData.mathFormula, { throwOnError: false });
      } catch (e) {
        previewContent = 'Invalid LaTeX';
      }
    }
    return (
      <div
        className={`border p-4 mt-4 rounded-lg ${formData.subject === 'Urdu' ? 'text-right' : ''}`}
        dangerouslySetInnerHTML={{ __html: previewContent }}
      />
    );
  };

  const generateExcelTemplate = () => {
    if (!formData.grade || !formData.subject) {
      setToast({ type: 'error', message: 'Please select Class and Subject to generate template' });
      return;
    }
    const optionLabels = formData.subject === 'Urdu' ? ['ا', 'ب', 'ج', 'د', 'ھ', 'و'] : ['A', 'B', 'C', 'D', 'E', 'F'];
    const ws = XLSX.utils.json_to_sheet([
      {
        questionType: 'MCQS',
        difficulty: 'Easy',
        slo: formData.subject === 'Urdu' ? 'بنیادی گرامر کو سمجھیں' : 'Understand basic grammar',
        question: formData.subject === 'Urdu' ? 'بلی کا جمع کیا ہے؟' : 'What is the plural of cat?',
        [`option${optionLabels[0]}`]: formData.subject === 'Urdu' ? 'بلیاں' : 'Cats',
        [`option${optionLabels[1]}`]: formData.subject === 'Urdu' ? 'بلی' : 'Cat',
        [`option${optionLabels[2]}`]: formData.subject === 'Urdu' ? 'بلیوں' : 'Cates',
        [`option${optionLabels[3]}`]: '',
        correctOption: optionLabels[0],
        explanation: formData.subject === 'Urdu' ? 'جمع کی شکل میں "س" شامل ہوتا ہے۔' : 'Plural form adds "s".',
      },
      {
        questionType: 'FILL_BLANKS',
        difficulty: 'Medium',
        slo: formData.subject === 'Urdu' ? 'بنیادی مساوات حل کریں' : 'Solve basic equations',
        question: formData.subject === 'Urdu' ? '{blank1} + 5 = 10 کے لیے x حل کریں' : 'Solve for x: {blank1} + 5 = 10',
        answers_blank1: '5|4+1',
        explanation: formData.subject === 'Urdu' ? 'دونوں اطراف سے 5 گھٹائیں۔' : 'Subtract 5 from both sides.',
      },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Questions');
    XLSX.writeFile(wb, `Questions_Class${formData.grade}_${formData.subject}.xlsx`);
  };

  // Urdu placeholders
  const urduPlaceholders = {
    questionText: 'سوال کا متن درج کریں',
    slo: 'SLO درج کریں',
    explanation: 'وضاحت (اختیاری)',
    options: ['ا- اختیار', 'ب- اختیار', 'ج- اختیار', 'د- اختیار', 'ھ- اختیار', 'و- اختیار'],
    correctAnswer: {
      short: 'صحیح جواب',
      long: 'ماڈل جواب / مارکنگ گائیڈنس',
      truefalse: ['صحیح', 'غلط'],
    },
    blanks: (blankId) => `جوابات ${blankId} کے لیے (مثال: جواب1|جواب2)`,
  };

  const isUrdu = formData.subject === 'Urdu';
  const inputDir = isUrdu ? 'rtl' : 'ltr';
  const inputFont = isUrdu ? 'font-[Noto Nastaliq Urdu]' : '';
  const optionLabels = isUrdu ? ['ا', 'ب', 'ج', 'د', 'ھ', 'و'] : ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole="Teacher" currentPage="questions" />
      <div className="flex-1 overflow-y-auto p-8 ml-[256px]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Question</h1>
          <p className="text-gray-600">Add individual questions or upload multiple questions for your classes</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Creation</h3>
              <div className="flex gap-4 mb-6">
                <button
                  className={`px-4 py-2 rounded-lg font-medium text-sm ${mode === 'individual' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  onClick={() => setMode('individual')}
                >
                  Individual
                </button>
                <button
                  className={`px-4 py-2 rounded-lg font-medium text-sm ${mode === 'bulk' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  onClick={() => setMode('bulk')}
                >
                  Bulk Upload
                </button>
                <button
                  onClick={generateExcelTemplate}
                  className={`px-4 py-2 rounded-lg font-medium text-sm ${formData.grade && formData.subject ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  disabled={!formData.grade || !formData.subject}
                >
                  Download Template
                </button>
              </div>

              {toast && (
                <div className={`p-4 mb-4 rounded-lg ${toast.type === 'error' ? 'bg-red-100 text-red-700' : toast.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {toast.message}
                </div>
              )}

              {mode === 'individual' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                    <select
                      name="grade"
                      value={formData.grade}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Class</option>
                      {grades.map((grade) => (
                        <option key={grade} value={grade}>Class {grade}</option>
                      ))}
                    </select>
                    {errors.grade && <p className="text-red-500 text-sm mt-1">{errors.grade}</p>}
                  </div>

                  {formData.grade && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Subject</option>
                        {subjectsByGrade[formData.grade]?.map((subject) => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                      {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                    </div>
                  )}

                  {formData.subject && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Book</label>
                      <select
                        name="book"
                        value={formData.book}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Book</option>
                        {booksBySubject[formData.subject]?.map((book) => (
                          <option key={book} value={book}>{book}</option>
                        ))}
                      </select>
                      {errors.book && <p className="text-red-500 text-sm mt-1">{errors.book}</p>}
                    </div>
                  )}

                  {formData.book && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Chapter</label>
                      <select
                        name="chapter"
                        value={formData.chapter}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Chapter</option>
                        {chaptersByBook[formData.book]?.map((chapter) => (
                          <option key={chapter} value={chapter}>{chapter}</option>
                        ))}
                      </select>
                      {errors.chapter && <p className="text-red-500 text-sm mt-1">{errors.chapter}</p>}
                    </div>
                  )}

                  {formData.chapter && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                      <select
                        name="topic"
                        value={formData.topic}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Topic</option>
                        {topicsByChapter[formData.chapter]?.map((topic) => (
                          <option key={topic} value={topic}>{topic}</option>
                        ))}
                      </select>
                      {errors.topic && <p className="text-red-500 text-sm mt-1">{errors.topic}</p>}
                    </div>
                  )}

                  {formData.topic && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                      <select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                      {errors.difficulty && <p className="text-red-500 text-sm mt-1">{errors.difficulty}</p>}
                    </div>
                  )}

                  {formData.difficulty && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Question Type</option>
                        <option value="multiple">Multiple Choice Questions (MCQ)</option>
                        <option value="truefalse">True/False</option>
                        <option value="short">Short Answer</option>
                        <option value="long">Long Answer</option>
                        <option value="fillblanks">Fill in the Blanks</option>
                      </select>
                      {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                    </div>
                  )}

                  {formData.type && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">SLO</label>
                        <input
                          name="slo"
                          value={formData.slo}
                          onChange={handleChange}
                          placeholder={isUrdu ? urduPlaceholders.slo : 'Enter SLO'}
                          className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputFont} ${isUrdu ? 'text-right' : ''}`}
                          dir={inputDir}
                        />
                        {errors.slo && <p className="text-red-500 text-sm mt-1">{errors.slo}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
                        <textarea
                          name="questionText"
                          value={formData.questionText}
                          onChange={handleChange}
                          placeholder={isUrdu ? urduPlaceholders.questionText : 'Question Text (e.g., "The capital of France is {blank1}")'}
                          className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputFont} ${isUrdu ? 'text-right' : ''}`}
                          dir={inputDir}
                          rows={4}
                        />
                        {errors.questionText && <p className="text-red-500 text-sm mt-1">{errors.questionText}</p>}
                      </div>

                      {formData.subject === 'Math' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Math Formula (LaTeX)</label>
                          <textarea
                            name="mathFormula"
                            value={formData.mathFormula}
                            onChange={handleChange}
                            placeholder="Enter LaTeX (e.g., $x^2 + 2x + 1$)"
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={4}
                          />
                          {errors.mathFormula && <p className="text-red-500 text-sm mt-1">{errors.mathFormula}</p>}
                          {renderPreview()}
                        </div>
                      )}

                      {formData.type === 'multiple' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                          {formData.options.map((opt, i) => (
                            <div key={i} className="flex gap-2 mb-2 items-center">
                              <span className={`w-16 text-sm ${isUrdu ? 'text-right' : ''}`}>{isUrdu ? urduPlaceholders.options[i] : `Option ${optionLabels[i]}`}</span>
                              <input
                                value={opt}
                                onChange={(e) => handleOptionChange(i, e.target.value)}
                                placeholder={isUrdu ? urduPlaceholders.options[i] : `Option ${optionLabels[i]}`}
                                className={`flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputFont} ${isUrdu ? 'text-right' : ''}`}
                                dir={inputDir}
                              />
                              {formData.options.length > 2 && (
                                <button
                                  onClick={() => removeOption(i)}
                                  className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          ))}
                          {formData.options.length < 6 && (
                            <button
                              onClick={addOption}
                              className="mt-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300"
                            >
                              Add Option
                            </button>
                          )}
                          {errors.options && <p className="text-red-500 text-sm mt-1">{errors.options}</p>}
                        </div>
                      )}

                      {formData.type === 'fillblanks' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Blank Answers</label>
                          {Object.keys(formData.blanks).map((blankId, i) => (
                            <div key={blankId} className="flex gap-2 mb-2 items-center">
                              <input
                                value={formData.blanks[blankId].join('|')}
                                onChange={(e) => handleBlankChange(blankId, e.target.value)}
                                placeholder={isUrdu ? urduPlaceholders.blanks(blankId) : `Answers for ${blankId} (e.g., answer1|answer2)`}
                                className={`flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputFont} ${isUrdu ? 'text-right' : ''}`}
                                dir={inputDir}
                              />
                              <button
                                onClick={() => removeBlank(blankId)}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={addBlank}
                            className="mt-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300"
                          >
                            Add Blank Answer
                          </button>
                          {errors.blanks && <p className="text-red-500 text-sm mt-1">{errors.blanks}</p>}
                          {Object.keys(errors)
                            .filter((key) => key.startsWith('blank'))
                            .map((key) => (
                              <p key={key} className="text-red-500 text-sm mt-1">{errors[key]}</p>
                            ))}
                        </div>
                      )}

                      {['short', 'long'].includes(formData.type) && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {formData.type === 'short' ? 'Correct Answer' : 'Model Answer / Marking Guidance'}
                          </label>
                          <textarea
                            name="correctAnswer"
                            value={formData.correctAnswer}
                            onChange={handleChange}
                            placeholder={
                              isUrdu
                                ? formData.type === 'short'
                                  ? urduPlaceholders.correctAnswer.short
                                  : urduPlaceholders.correctAnswer.long
                                : formData.type === 'short'
                                ? 'Correct Answer'
                                : 'Model Answer / Marking Guidance'
                            }
                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputFont} ${isUrdu ? 'text-right' : ''}`}
                            dir={inputDir}
                            rows={4}
                          />
                          {errors.correctAnswer && <p className="text-red-500 text-sm mt-1">{errors.correctAnswer}</p>}
                        </div>
                      )}

                      {formData.type === 'truefalse' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                          <select
                            name="correctAnswer"
                            value={formData.correctAnswer}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Correct Answer</option>
                            {isUrdu ? (
                              <>
                                <option value="true">{urduPlaceholders.correctAnswer.truefalse[0]}</option>
                                <option value="false">{urduPlaceholders.correctAnswer.truefalse[1]}</option>
                              </>
                            ) : (
                              <>
                                <option value="true">True</option>
                                <option value="false">False</option>
                              </>
                            )}
                          </select>
                          {errors.correctAnswer && <p className="text-red-500 text-sm mt-1">{errors.correctAnswer}</p>}
                        </div>
                      )}

                      {formData.type === 'multiple' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                          <select
                            name="correctAnswer"
                            value={formData.correctAnswer}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputFont} ${isUrdu ? 'text-right' : ''}`}
                            dir={inputDir}
                          >
                            <option value="">Select Correct Answer</option>
                            {formData.options.map((opt, i) => (
                              <option key={i} value={opt}>
                                {`${optionLabels[i]}. ${opt || (isUrdu ? urduPlaceholders.options[i] : `Option ${optionLabels[i]}`)}`}
                              </option>
                            ))}
                          </select>
                          {errors.correctAnswer && <p className="text-red-500 text-sm mt-1">{errors.correctAnswer}</p>}
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Explanation (Optional)</label>
                        <textarea
                          name="explanation"
                          value={formData.explanation}
                          onChange={handleChange}
                          placeholder={isUrdu ? urduPlaceholders.explanation : 'Explanation (optional)'}
                          className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputFont} ${isUrdu ? 'text-right' : ''}`}
                          dir={inputDir}
                          rows={4}
                        />
                        {errors.explanation && <p className="text-red-500 text-sm mt-1">{errors.explanation}</p>}
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={handleSubmit}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                        >
                          Submit
                        </button>
                        <button
                          onClick={handleReset}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                        >
                          Reset
                        </button>
                        <button
                          onClick={() => setToast({ type: 'info', message: 'Preview not implemented' })}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                        >
                          Preview
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Upload</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                        <select
                          name="grade"
                          value={formData.grade}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Class</option>
                          {grades.map((grade) => (
                            <option key={grade} value={grade}>Class {grade}</option>
                          ))}
                        </select>
                        {errors.grade && <p className="text-red-500 text-sm mt-1">{errors.grade}</p>}
                      </div>
                      {formData.grade && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                          <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Subject</option>
                            {subjectsByGrade[formData.grade]?.map((subject) => (
                              <option key={subject} value={subject}>{subject}</option>
                            ))}
                          </select>
                          {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                      <input
                        type="file"
                        accept=".xlsx,.csv"
                        onChange={handleFileUpload}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={!formData.grade || !formData.subject}
                      />
                    </div>

                    {csvData.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Preview</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse text-sm">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="border p-2 text-left">Row</th>
                                <th className="border p-2 text-left">Question</th>
                                <th className="border p-2 text-left">Type</th>
                                <th className="border p-2 text-left">Errors</th>
                              </tr>
                            </thead>
                            <tbody>
                              {csvData.map(({ row, errors, index }) => (
                                <tr key={index} className={errors.length > 0 ? 'bg-red-50' : ''}>
                                  <td className="border p-2">{index + 1}</td>
                                  <td className="border p-2">{row.question}</td>
                                  <td className="border p-2">{row.questionType}</td>
                                  <td className="border p-2">{errors.join(', ')}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <button
                        onClick={uploadBulk}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${csvData.length === 0 || csvData.every((d) => d.errors.length > 0) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        disabled={csvData.length === 0 || csvData.every((d) => d.errors.length > 0)}
                      >
                        Upload & Validate
                      </button>
                      <button
                        onClick={() => setCsvData([])}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Class:</span>
                  <span className="font-medium text-gray-900">{formData.grade || 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subject:</span>
                  <span className="font-medium text-gray-900">{formData.subject || 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Book:</span>
                  <span className="font-medium text-gray-900">{formData.book || 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chapter:</span>
                  <span className="font-medium text-gray-900">{formData.chapter || 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Topic:</span>
                  <span className="font-medium text-gray-900">{formData.topic || 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Question Type:</span>
                  <span className="font-medium text-gray-900">{formData.type ? formData.type === 'multiple' ? 'Multiple Choice (MCQs)' : formData.type.replace(/([A-Z])/g, ' $1').trim() : 'None'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCreator;