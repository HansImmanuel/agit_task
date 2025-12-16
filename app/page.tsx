import prisma from '@/lib/prisma';
import TasksComponent from '../components/ui/tasks_component'
import GradientText from '../components/GradientText'
import LiquidChrome from '../components/LiquidChrome';
import GradualBlur from '../components/GradualBlur';

export default async function Home() {
  const tasks = await prisma.task.findMany({
    where: {
      deleted_at: null,
    },
    orderBy: {
      createdAt: 'desc',
    },

  });

  return (
    
    <main className="min-h-screen relative">
      <div className="fixed inset-0 z-0">
        <LiquidChrome
          baseColor={[0.1, 0, 0.1]}
          speed={0.18}
          amplitude={0.3}   
          interactive={false}
        />
      </div>
      <div className="relative z-10 py-10">
        <h1 className="text-6xl tracking-tight mb-6 text-center">
          <GradientText
            colors={["#e3dfe6ff", "#ffffffff", "#d4d3d3ff", "#e4ecffff", "#ffffffff"]}
            animationSpeed={10}
            showBorder={false}
            className="custom-class font-extrabold font-outfit"
          >
            Task Manager
          </GradientText>


        </h1>
        <div className='text-center text-sm text-white pt-4'>
          Click on the Task's name to view it's description
        </div>
        <TasksComponent initialData={tasks} />
      </div>
      <GradualBlur
        target="page"
        position="bottom"
        height="6rem"
        strength={1}
        divCount={5}
        curve="bezier"
        exponential={true}
        opacity={1}
        zIndex={50}
      />
    </main>
  );
}