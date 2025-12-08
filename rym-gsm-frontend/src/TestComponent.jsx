// Simple test component to verify TailwindCSS is working
const TestComponent = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: 'red', color: 'white' }}>
      <h1>If you see this in RED, React is working</h1>
      <div className="bg-blue-500 text-white p-4 rounded-lg mt-4">
        <h2>If you see this in BLUE with rounded corners, TailwindCSS is working!</h2>
      </div>
    </div>
  );
};

export default TestComponent;
