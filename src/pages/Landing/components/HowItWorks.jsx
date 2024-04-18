import { motion } from "framer-motion";
import { cn } from "../../../utils";

const howItWorks = [
  {
    title: "Create Your Habits",
    description: "Input your habit details and start tracking from day one",
  },
  {
    title: "Visualize Your Progress",
    description:
      "Use the summary view for a quick overview and the calendar-like view for detailed history.",
  },
  {
    title: "Celebrate Achievements",
    description: "Reach milestones, earn badges and keep the motivation high.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-10 md:py-20">
      <h2 className="text-4xl font-bold text-white text-center mb-12 ">
        How it works?
      </h2>
      <div className="select-none flex flex-col max-w-4xl mx-auto gap-10">
        {howItWorks.map((item, index) => {
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: "all" }}
              className={cn(
                `group  md:flex md:items-center md:gap-10  max-w-lg  `,
                {
                  "self-center": index === 1,
                  "self-end": index === 2,
                }
              )}
            >
              <h3 className="group-hover:text-emerald-600 transition-colors text-5xl mb-4 text-zinc-400 font-bold  md:h-20 md:w-20 flex-shrink-0 md:grid md:place-content-center">
                {index + 1}
              </h3>
              <div className="relative p-4 rounded-lg bg-gradient-to-tr from-white/5  border-[1px] border-white/10 before:h-full before:absolute  before:z-10 before:w-full before:bg-[url('/noise.svg')] before:content-[' '] before:block before:left-0 before:top-0 before:opacity-10">
                <p className="text-white mb-1 text-lg font-medium ">
                  {item.title}
                </p>
                <p className="text-zinc-400  font-medium">{item.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default HowItWorks;
