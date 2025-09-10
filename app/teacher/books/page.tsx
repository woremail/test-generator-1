'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';

export default function BookManagement() {
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [showEditChapter, setShowEditChapter] = useState(false);
  const [editingChapter, setEditingChapter] = useState<any>(null);
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [selectedChapterForTopic, setSelectedChapterForTopic] = useState<any>(null);

  const [chapterForm, setChapterForm] = useState({
    title: '',
    description: ''
  });

  const [topicForm, setTopicForm] = useState({
    title: '',
    description: ''
  });

  const [books, setBooks] = useState([
    // Grade 6 Books
    {
      id: 3,
      title: 'Science Explorer',
      subject: 'Science',
      grade: '6th Grade',
      chapters: [
        { id: 1, title: 'Living Things', topics: 5, questions: 20, description: 'Introduction to plants and animals' },
        { id: 2, title: 'Matter and Materials', topics: 4, questions: 18, description: 'Basic properties of matter' },
        { id: 3, title: 'Earth and Space', topics: 6, questions: 25, description: 'Understanding the solar system and Earth' },
      ],
      totalQuestions: 63,
      status: 'Active'
    },
    {
      id: 4,
      title: 'Math',
      subject: 'Mathematics',
      grade: '6th Grade',
      chapters: [
        { id: 1, title: 'Numbers and Operations', topics: 6, questions: 30, description: 'Basic arithmetic and number sense' },
        { id: 2, title: 'Geometry', topics: 5, questions: 22, description: 'Shapes, angles, and measurements' },
        { id: 3, title: 'Data Handling', topics: 3, questions: 15, description: 'Charts, graphs, and statistics' },
      ],
      totalQuestions: 67,
      status: 'Active'
    },
    {
      id: 5,
      title: 'English',
      subject: 'English',
      grade: '6th Grade',
      chapters: [
        { id: 1, title: 'Grammar and Usage', topics: 5, questions: 20, description: 'Parts of speech and sentence structure' },
        { id: 2, title: 'Reading Comprehension', topics: 4, questions: 18, description: 'Understanding and analyzing texts' },
        { id: 3, title: 'Creative Writing', topics: 3, questions: 12, description: 'Writing stories and paragraphs' },
      ],
      totalQuestions: 50,
      status: 'Active'
    },
    // Grade 7 Books
    {
      id: 6,
      title: 'Science Discoveries',
      subject: 'Science',
      grade: '7th Grade',
      chapters: [
        { id: 1, title: 'Human Body Systems', topics: 6, questions: 28, description: 'Functions of major body systems' },
        { id: 2, title: 'Forces and Energy', topics: 5, questions: 24, description: 'Basic physics concepts' },
        { id: 3, title: 'Environment and Conservation', topics: 4, questions: 20, description: 'Protecting natural resources' },
      ],
      totalQuestions: 72,
      status: 'Active'
    },
    {
      id: 7,
      title: 'Math Essentials',
      subject: 'Mathematics',
      grade: '7th Grade',
      chapters: [
        { id: 1, title: 'Integers and Rational Numbers', topics: 5, questions: 26, description: 'Working with positive and negative numbers' },
        { id: 2, title: 'Algebraic Expressions', topics: 6, questions: 30, description: 'Introduction to algebra' },
        { id: 3, title: 'Probability and Statistics', topics: 4, questions: 18, description: 'Understanding chance and data' },
      ],
      totalQuestions: 74,
      status: 'Active'
    },
    {
      id: 8,
      title: 'English Skills Builder',
      subject: 'English',
      grade: '7th Grade',
      chapters: [
        { id: 1, title: 'Advanced Grammar', topics: 6, questions: 24, description: 'Tenses, clauses, and sentence types' },
        { id: 2, title: 'Literature and Analysis', topics: 5, questions: 20, description: 'Reading and interpreting literary texts' },
        { id: 3, title: 'Essay and Report Writing', topics: 4, questions: 16, description: 'Structured writing techniques' },
      ],
      totalQuestions: 60,
      status: 'Active'
    },
  ]);

  const handleAddChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapterForm.title.trim()) {
      alert('Chapter title is required');
      return;
    }

    const newChapter = {
      id: Date.now(),
      title: chapterForm.title,
      description: chapterForm.description,
      topics: 0,
      questions: 0
    };

    setBooks(prev => prev.map(book => 
      book.id === selectedBook.id 
        ? { ...book, chapters: [...book.chapters, newChapter] }
        : book
    ));

    setSelectedBook(prev => ({
      ...prev,
      chapters: [...prev.chapters, newChapter]
    }));

    setChapterForm({ title: '', description: '' });
    setShowAddChapter(false);
    alert('Chapter added successfully!');
  };

  const handleEditChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapterForm.title.trim()) {
      alert('Chapter title is required');
      return;
    }

    const updatedChapter = {
      ...editingChapter,
      title: chapterForm.title,
      description: chapterForm.description
    };

    setBooks(prev => prev.map(book => 
      book.id === selectedBook.id 
        ? { 
            ...book, 
            chapters: book.chapters.map(ch => 
              ch.id === editingChapter.id ? updatedChapter : ch
            ) 
          }
        : book
    ));

    setSelectedBook(prev => ({
      ...prev,
      chapters: prev.chapters.map(ch => 
        ch.id === editingChapter.id ? updatedChapter : ch
      )
    }));

    setChapterForm({ title: '', description: '' });
    setEditingChapter(null);
    setShowEditChapter(false);
    alert('Chapter updated successfully!');
  };

  const deleteChapter = (chapterId: number) => {
    if (confirm('Are you sure you want to delete this chapter? This will also delete all topics and questions within it.')) {
      setBooks(prev => prev.map(book => 
        book.id === selectedBook.id 
          ? { 
              ...book, 
              chapters: book.chapters.filter(ch => ch.id !== chapterId),
              totalQuestions: book.totalQuestions - (book.chapters.find(ch => ch.id === chapterId)?.questions || 0)
            }
          : book
      ));

      setSelectedBook(prev => ({
        ...prev,
        chapters: prev.chapters.filter(ch => ch.id !== chapterId)
      }));

      alert('Chapter deleted successfully!');
    }
  };

  const openEditChapter = (chapter: any) => {
    setEditingChapter(chapter);
    setChapterForm({
      title: chapter.title,
      description: chapter.description || ''
    });
    setShowEditChapter(true);
  };

  const openAddTopic = (chapter: any) => {
    setSelectedChapterForTopic(chapter);
    setShowAddTopic(true);
  };

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicForm.title.trim()) {
      alert('Topic title is required');
      return;
    }

    alert(`Topic "${topicForm.title}" added to chapter "${selectedChapterForTopic.title}"`);
    setTopicForm({ title: '', description: '' });
    setShowAddTopic(false);
    setSelectedChapterForTopic(null);
  };

  const AddChapterModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Add New Chapter</h3>
          <button
            onClick={() => setShowAddChapter(false)}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>
        
        <form onSubmit={handleAddChapter} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chapter Title</label>
            <input
              type="text"
              value={chapterForm.title}
              onChange={(e) => setChapterForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter chapter title"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={chapterForm.description}
              onChange={(e) => setChapterForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Brief description of the chapter"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer whitespace-nowrap"
            >
              Add Chapter
            </button>
            <button
              type="button"
              onClick={() => setShowAddChapter(false)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg cursor-pointer whitespace-nowrap"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const EditChapterModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Edit Chapter</h3>
          <button
            onClick={() => setShowEditChapter(false)}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>
        
        <form onSubmit={handleEditChapter} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chapter Title</label>
            <input
              type="text"
              value={chapterForm.title}
              onChange={(e) => setChapterForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter chapter title"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={chapterForm.description}
              onChange={(e) => setChapterForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Brief description of the chapter"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer whitespace-nowrap"
            >
              Update Chapter
            </button>
            <button
              type="button"
              onClick={() => setShowEditChapter(false)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg cursor-pointer whitespace-nowrap"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const AddTopicModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Add New Topic</h3>
          <button
            onClick={() => setShowAddTopic(false)}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>
        
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Adding topic to: <strong>{selectedChapterForTopic?.title}</strong>
          </p>
        </div>
        
        <form onSubmit={handleAddTopic} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Topic Title</label>
            <input
              type="text"
              value={topicForm.title}
              onChange={(e) => setTopicForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter topic title"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={topicForm.description}
              onChange={(e) => setTopicForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Brief description of the topic"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer whitespace-nowrap"
            >
              Add Topic
            </button>
            <button
              type="button"
              onClick={() => setShowAddTopic(false)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg cursor-pointer whitespace-nowrap"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole="Teacher" currentPage="books" />
      
      <div className="flex-1 overflow-y-auto p-8 ml-[256px]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Management</h1>
          <p className="text-gray-600">Manage your assigned books, chapters, and topics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Books</h3>
              <div className="space-y-3">
                {books.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => setSelectedBook(book)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedBook?.id === book.id
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{book.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        book.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {book.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{book.subject} • {book.grade}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="flex items-center mr-4">
                        <i className="ri-book-open-line mr-1"></i>
                        {book.chapters.length} chapters
                      </span>
                      <span className="flex items-center">
                        <i className="ri-question-line mr-1"></i>
                        {book.totalQuestions} questions
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedBook ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedBook.title}</h3>
                    <p className="text-gray-600">{selectedBook.subject} • {selectedBook.grade}</p>
                  </div>
                  <button
                    onClick={() => setShowAddChapter(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-add-line mr-2"></i>
                    Add Chapter
                  </button>
                </div>

                <div className="space-y-4">
                  {selectedBook.chapters.map((chapter: any) => (
                    <div key={chapter.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Chapter {chapter.id}: {chapter.title}</h4>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => openEditChapter(chapter)}
                            className="text-blue-600 hover:text-blue-700 cursor-pointer"
                            title="Edit Chapter"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button 
                            onClick={() => openAddTopic(chapter)}
                            className="text-green-600 hover:text-green-700 cursor-pointer"
                            title="Add Topic"
                          >
                            <i className="ri-add-circle-line"></i>
                          </button>
                          <button 
                            onClick={() => deleteChapter(chapter.id)}
                            className="text-red-600 hover:text-red-700 cursor-pointer"
                            title="Delete Chapter"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </div>
                      
                      {chapter.description && (
                        <p className="text-sm text-gray-600 mb-3">{chapter.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center">
                          <i className="ri-bookmark-line mr-1"></i>
                          {chapter.topics} topics
                        </span>
                        <span className="flex items-center">
                          <i className="ri-question-line mr-1"></i>
                          {chapter.questions} questions
                        </span>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Topics:</h5>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">DNA Structure</span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">RNA Function</span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Protein Synthesis</span>
                          <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded-full text-xs">+{chapter.topics - 3} more</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{selectedBook.chapters.length}</p>
                      <p className="text-sm text-gray-600">Total Chapters</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {selectedBook.chapters.reduce((sum: number, ch: any) => sum + ch.topics, 0)}
                      </p>
                      <p className="text-sm text-gray-600">Total Topics</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">{selectedBook.totalQuestions}</p>
                      <p className="text-sm text-gray-600">Total Questions</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-book-line text-2xl text-gray-400"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Book</h3>
                <p className="text-gray-600">Choose a book from the left panel to view and manage its chapters and topics.</p>
              </div>
            )}
          </div>
        </div>

        {showAddChapter && <AddChapterModal />}
        {showEditChapter && <EditChapterModal />}
        {showAddTopic && <AddTopicModal />}
      </div>
    </div>
  );
}