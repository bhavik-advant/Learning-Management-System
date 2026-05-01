'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';

type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  author: string;
  status: string;
  modulesCount: number;
};

function SelectableCourse({
  course,
  isSelected,
  onCheckboxChange,
}: {
  course: Course;
  isSelected: boolean;
  onCheckboxChange: () => void;
}) {
  const handleCardClick = () => {
    onCheckboxChange();
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card
      onClick={handleCardClick}
      className="flex flex-col h-full p-0 bg-gray-900/90 overflow-hidden hover:shadow-lg dark:hover:shadow-lg transition-all duration-200 cursor-pointer border border-border shadow-md dark:shadow-md"
    >
      <div className="relative w-full h-32 overflow-hidden bg-slate-200 dark:bg-slate-700">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="w-full h-full object-cover"
        />

        <div
          className="absolute top-2 left-2 bg-slate-100 dark:bg-slate-800 rounded p-1 shadow-md border border-border"
          onClick={e => e.stopPropagation()}
        >
          <Checkbox
            id={course.id}
            checked={isSelected}
            onCheckedChange={onCheckboxChange}
            className="w-4 h-4 cursor-pointer "
          />
        </div>

        <div className="absolute top-2 right-2 bg-blue-600 dark:bg-blue-700 text-white text-xs font-medium px-2 py-1 rounded shadow-md">
          {course.status}
        </div>
      </div>

      <div className="flex flex-col flex-1 px-4 pb-4 gap-3">
        <h3 className="font-semibold text-sm line-clamp-2 text-foreground">{course.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 flex-1">{course.description}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-2">
          <span className="truncate">{course.author}</span>
          <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-foreground">
            {course.modulesCount} modules
          </span>
        </div>
        <Button size="sm" className="w-full h-8 text-xs font-medium" onClick={handleButtonClick}>
          View Course
        </Button>
      </div>
    </Card>
  );
}

export default SelectableCourse;
