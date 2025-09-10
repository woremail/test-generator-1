
'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import StatCard from '@/components/StatCard';

export default function AdminDashboard() {
  const [selectedReview, setSelectedReview] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [reviewDecision, setReviewDecision] = useState('');
  const [reviewComments, setReviewComments] = useState('');
  const [messageText, setMessageText] = useState('');

  const recentActivities = [
    { id: 1, user: 'Sarah Johnson', action: 'Added 15 questions to Biology Chapter 3', time: '2 hours ago', avatar: 'SJ' },
    { id: 2, user: 'Mike Chen', action: 'Created a new quiz for Mathematics', time: '4 hours ago', avatar: 'MC' },
    { id: 3, user: 'Emma Wilson', action: 'Updated profile information', time: '6 hours ago', avatar: 'EW' },
    { id: 4, user: 'David Brown', action: 'Added new book "Advanced Physics"', time: '8 hours ago', avatar: 'DB' },
    { id: 5, user: 'Lisa Garcia', action: 'Generated quiz for History Chapter 2', time: '1 day ago', avatar: 'LG' },
  ];

  const [pendingReviews, setPendingReviews] = useState([
    { id: 1, teacher: 'John Smith', subject: 'Chemistry', questions: 12, submitted: '2024-01-15', status: 'pending' },
    { id: 2, teacher: 'Maria Rodriguez', subject: 'Biology', questions: 8, submitted: '2024-01-14', status: 'pending' },
    { id: 3, teacher: 'Alex Kim', subject: 'Physics', questions: 15, submitted: '2024-01-13', status: 'pending' },
  ]);

  const handleReview = (review) => {
    setSelectedReview(review);
    setShowReviewModal(true);
    setReviewDecision('');
    setReviewComments('');
  };

  const handleMessage = (review) => {
    setSelectedReview(review);
    setShowMessageModal(true);
    setMessageText('');
  };

  const submitReview = () => {
    if (!reviewDecision) return;

    setPendingReviews((prev) =>
      prev.map((review) =>
        review.id === selectedReview.id ? { ...review, status: reviewDecision } : review
      )
    );

    setShowReviewModal(false);
    setSelectedReview(null);
  };

  const sendMessage = () => {
    if (!messageText.trim()) return;

    // Here you would typically send the message to the teacher
    console.log(`Message sent to ${selectedReview.teacher}: ${messageText}`);

    setShowMessageModal(false);
    setSelectedReview(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="Admin" currentPage="dashboard" />

      <div className="flex-1 overflow-y-auto p-2 ml-[256px]">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening in your quiz system.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Users"
              value="247"
              icon="ri-team-line"
              color="blue"
              trend={{ value: "+12%", isPositive: true }}
            />
            <StatCard
              title="Active Books"
              value="89"
              icon="ri-book-line"
              color="green"
              trend={{ value: "+8%", isPositive: true }}
            />
            <StatCard
              title="Questions Created"
              value="1,423"
              icon="ri-question-answer-line"
              color="purple"
              trend={{ value: "+23%", isPositive: true }}
            />
            <StatCard
              title="Quizzes Generated"
              value="356"
              icon="ri-file-list-3-line"
              color="orange"
              trend={{ value: "+15%", isPositive: true }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer whitespace-nowrap">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                      {activity.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Pending Reviews</h3>
                <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                  {pendingReviews.filter((review) => review.status === 'pending').length} pending
                </span>
              </div>
              <div className="space-y-4">
                {pendingReviews
                  .filter((review) => review.status === 'pending')
                  .map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{review.teacher}</h4>
                        <span className="text-xs text-gray-500">{review.submitted}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {review.subject} - {review.questions} questions
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleReview(review)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded cursor-pointer whitespace-nowrap"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => handleMessage(review)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium py-2 px-3 rounded cursor-pointer whitespace-nowrap"
                        >
                          Message
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">System Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-graduation-cap-line text-2xl text-blue-600"></i>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Active Teachers</h4>
                <p className="text-2xl font-bold text-blue-600">42</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-book-open-line text-2xl text-green-600"></i>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Subjects</h4>
                <p className="text-2xl font-bold text-green-600">12</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-file-list-line text-2xl text-purple-600"></i>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Categories</h4>
                <p className="text-2xl font-bold text-purple-600">8</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Review Submission</h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">
                  Teacher: <span className="font-medium">{selectedReview?.teacher}</span>
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Subject: <span className="font-medium">{selectedReview?.subject}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Questions: <span className="font-medium">{selectedReview?.questions}</span>
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Decision</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="decision"
                      value="approved"
                      checked={reviewDecision === 'approved'}
                      onChange={(e) => setReviewDecision(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-green-600">Approve</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="decision"
                      value="rejected"
                      checked={reviewDecision === 'rejected'}
                      onChange={(e) => setReviewDecision(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-red-600">Reject</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="decision"
                      value="needs_revision"
                      checked={reviewDecision === 'needs_revision'}
                      onChange={(e) => setReviewDecision(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-orange-600">Needs Revision</span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                <textarea
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  placeholder="Add your review comments..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  rows="3"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReview}
                  disabled={!reviewDecision}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer whitespace-nowrap disabled:bg-gray-300"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Send Message</h3>
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">To: <span className="font-medium">{selectedReview?.teacher}</span></p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  rows="4"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!messageText.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer whitespace-nowrap disabled:bg-gray-300"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
