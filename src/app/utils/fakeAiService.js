// This simulates an asynchronous AI process. 
// You might replace it with a real fetch(...) to your backend.

export function analyzeHomeworkMock() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return a random or fixed result
        resolve({
          grade: 'A',
          feedback: [
            'Great work on solving the quadratic equation!',
            'Minor note: Provide a bit more explanation on factoring steps.',
          ],
        });
      }, 2000); // 2-second delay to mimic "processing"
    });
  }
  