'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { FiPlus, FiEdit, FiTrash2, FiFileText, FiClipboard } from 'react-icons/fi';

// Mock data
const initialBooks = [
  {
    id: 1,
    title: 'Science Explorer',
    grade: '10th Grade',
    chapters: 3,
    questions: 63,
    status: 'Active',
    chapterDetails: [
      { id: 1, title: 'Chapter 1 - Living Things', description: 'Introduction to Plants and Animals', topics: 5, questions: 20, topicList: ['DNA Structure', 'RNA Function', 'Protein Synthesis', 'Plant DNA', 'Animal DNA'] },
      { id: 2, title: 'Chapter 2 - Matter and Materials', description: 'Basic Properties of Matter', topics: 4, questions: 18, topicList: ['DNA Structure', 'RNA Function', 'Protein Synthesis', 'Plant DNA'] },
      { id: 3, title: 'Chapter 3 - Plant Anatomy', description: 'Basic Anatomies of Plants', topics: 6, questions: 25, topicList: [] },
    ]
  },
  { id: 2, title: 'Math Understood', grade: '8th Grade', chapters: 5, questions: 67, status: 'Active', chapterDetails: [] },
  { id: 3, title: 'Spirit School', grade: '10th Grade', chapters: 2, questions: 21, status: 'Completed', chapterDetails: [] },
  { id: 4, title: 'Primary Mathematics', grade: '10th Grade', chapters: 3, questions: 35, status: 'Completed', chapterDetails: [] },
  { id: 5, title: 'Urdu Say Dosti', grade: '6th Grade', chapters: 2, questions: 25, status: 'Active', chapterDetails: [] },
];

const ChapterModal = ({ chapter, onSave, onCancel }: any) => {
  const [title, setTitle] = useState(chapter ? chapter.title : '');
  const [description, setDescription] = useState(chapter ? chapter.description : '');

  const handleSave = () => {
    onSave({ ...chapter, title, description });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{chapter ? 'Edit Chapter' : 'Add Chapter'}</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Chapter Title"
          className="w-full p-2 border rounded mb-4"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Chapter Description"
          className="w-full p-2 border rounded mb-4"
        />
        <div className="flex justify-end space-x-2">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

const AssignedBook = ({ book, isSelected, onClick }: any) => (
  <div onClick={onClick} className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${isSelected ? 'bg-[#FFF8E1] border-[#FFC107]' : 'bg-white border-gray-200'}`}>
    <div className="flex justify-between items-center mb-2">
      <div>
        <h3 className="font-bold text-orange-400">{book.title}</h3>
        <p className="text-sm text-gray-500">{book.grade}</p>
      </div>
      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${book.status === 'Active' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
        {book.status}
      </span>
    </div>
    <div className="flex items-center text-gray-600 text-sm space-x-4">
      <span className="flex items-center"><FiFileText className="mr-2"/>{book.chapters} Chapters</span>
      <span className="flex items-center"><FiClipboard className="mr-2"/>{book.questions} Questions</span>
    </div>
  </div>
);

const ChapterCard = ({ chapter, onEdit, onDelete }: any) => (
  <div className="bg-white border-2 border-gray-200 rounded-xl p-4 mb-4">
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-bold text-blue-900">{chapter.title}</h4>
        <p className="text-sm text-gray-500">{chapter.description}</p>
      </div>
      <div className="flex items-center space-x-2 text-gray-500">
        <button onClick={() => onEdit(chapter)} className="hover:text-blue-600"><FiEdit size={18} /></button>
        <button onClick={() => onDelete(chapter.id)} className="hover:text-red-600"><FiTrash2 size={18} /></button>
      </div>
    </div>
    <div className="flex items-center text-gray-600 text-sm space-x-4 my-3">
      <span className="flex items-center"><FiFileText className="mr-2"/>{chapter.topics} Topics</span>
      <span className="flex items-center"><FiClipboard className="mr-2"/>{chapter.questions} Questions</span>
    </div>
    <div>
      <p className="text-sm font-semibold text-gray-700 mb-2">Topics:</p>
      <div className="flex flex-wrap gap-2">
        {chapter.topicList.map((topic: string, index: number) => (
          <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 text-xs font-semibold rounded-full">{topic}</span>
        ))}
      </div>
    </div>
  </div>
);

export default function BooksAndChapters() {
  const [books, setBooks] = useState(initialBooks);
  const [selectedBook, setSelectedBook] = useState(books[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);

  const handleSaveChapter = (savedChapter: any) => {
    const updatedBooks = books.map(book => {
      if (book.id === selectedBook.id) {
        let updatedChapterDetails;
        if (savedChapter.id) { // Editing existing chapter
          updatedChapterDetails = book.chapterDetails.map(ch => ch.id === savedChapter.id ? savedChapter : ch);
        } else { // Adding new chapter
          const newChapter = { ...savedChapter, id: Date.now(), topics: 0, questions: 0, topicList: [] };
          updatedChapterDetails = [...book.chapterDetails, newChapter];
        }
        return { ...book, chapterDetails: updatedChapterDetails, chapters: updatedChapterDetails.length };
      }
      return book;
    });
    setBooks(updatedBooks);
    const updatedSelectedBook = updatedBooks.find(b => b.id === selectedBook.id);
    if (updatedSelectedBook) {
        setSelectedBook(updatedSelectedBook);
    }
    setIsModalOpen(false);
    setEditingChapter(null);
  };

  const deleteChapter = (chapterId: number) => {
    if (window.confirm('Are you sure you want to delete this chapter?')) {
      const updatedBooks = books.map(book => {
        if (book.id === selectedBook.id) {
          const updatedChapterDetails = book.chapterDetails.filter(chapter => chapter.id !== chapterId);
          return { ...book, chapterDetails: updatedChapterDetails, chapters: updatedChapterDetails.length };
        }
        return book;
      });
      setBooks(updatedBooks);
      const updatedSelectedBook = updatedBooks.find(b => b.id === selectedBook.id);
      if (updatedSelectedBook) {
        setSelectedBook(updatedSelectedBook);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar userRole="Teacher" currentPage="books" />
      <main className="flex-1 p-8 ml-[256px]">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Book Management</h1>
                <p className="text-gray-500">Manage your assigned books, chapters, and topics.</p>
            </div>
            <div className="flex items-center">
                <div className="w-12 h-12 bg-pink-100 rounded-full mr-4"></div>
                <div>
                    <p className="font-semibold text-gray-800">John Doe</p>
                    <p className="text-sm text-gray-500">Science Teacher</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-900">Assigned Books</h2>
              <button onClick={() => { setEditingChapter(null); setIsModalOpen(true); }} className="bg-blue-100 text-blue-600 p-2 rounded-full"><FiPlus size={20}/></button>
            </div>
            <div className="space-y-4">
              {books.map(book => (
                <AssignedBook key={book.id} book={book} isSelected={selectedBook.id === book.id} onClick={() => setSelectedBook(book)} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-[#FFF9E6] border-2 border-[#FFC107] rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-orange-500">{selectedBook.title}</h2>
                    <button onClick={() => { setEditingChapter(null); setIsModalOpen(true); }} className="bg-orange-400 text-white p-2 rounded-full"><FiPlus size={20}/></button>
                </div>
                <div>
                {selectedBook.chapterDetails.length > 0 ? (
                    selectedBook.chapterDetails.map(chapter => (
                      <ChapterCard key={chapter.id} chapter={chapter} onEdit={(ch: any) => { setEditingChapter(ch); setIsModalOpen(true); }} onDelete={deleteChapter} />
                    ))
                ) : (
                    <div className="text-center py-12 text-gray-500"><p>No chapters available for this book.</p></div>
                )}
                </div>
            </div>
          </div>
        </div>
        {isModalOpen && <ChapterModal chapter={editingChapter} onSave={handleSaveChapter} onCancel={() => { setIsModalOpen(false); setEditingChapter(null); }} />}
      </main>
    </div>
  );
}
