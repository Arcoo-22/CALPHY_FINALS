import { useOutletContext } from 'react-router-dom';
import { lessons, modules } from './data/mockData.js';

export function getInitials(name = '') {
  return name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'C';
}

export function useCalphy() {
  return useOutletContext();
}

export function lessonProgress(context) {
  return lessons.length ? Math.round((context.state.completedLessonIds.length / lessons.length) * 100) : 0;
}

export function lessonModule(lessonId) {
  return modules.find((module) => module.lessonIds.includes(lessonId));
}
