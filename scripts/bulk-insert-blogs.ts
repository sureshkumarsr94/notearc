import pool from '../src/lib/db';
import { marked } from 'marked';

interface BlogTopic {
    title: string;
    readTime: string;
}

const topics: BlogTopic[] = [
    { title: "The 5 AM Club", readTime: "16 min read" },
    { title: "Rich Dad Poor Dad", readTime: "17 min read" },
    { title: "No Excuses: The Power of Self-Discipline", readTime: "18 min read" },
    { title: "The Power of Now", readTime: "14 min read" },
    { title: "The 10X Rule", readTime: "13 min read" },
    { title: "Unlimited Memory", readTime: "15 min read" },
    { title: "The 4-Hour Body", readTime: "15 min read" },
    { title: "Limitless: Upgrade Your Brain", readTime: "17 min read" },
    { title: "Think and Grow Rich", readTime: "15 min read" },
    { title: "Quiet: The Power of Introverts", readTime: "15 min read" },
    { title: "Not Nice: Stop People Pleasing", readTime: "14 min read" },
    { title: "The 80/20 Principle", readTime: "13 min read" },
    { title: "The 5 Love Languages", readTime: "15 min read" },
    { title: "The Power of Habit: Transform Your Life", readTime: "18 min read" },
    { title: "Lean In: Women, Work, and the Will to Lead", readTime: "20 min read" },
    { title: "Elon Musk: Lessons from a Visionary", readTime: "14 min read" },
    { title: "Thinking, Fast and Slow", readTime: "15 min read" },
    { title: "Steal Like an Artist", readTime: "15 min read" },
    { title: "The Four Agreements", readTime: "15 min read" },
    { title: "Don't Overthink It", readTime: "14 min read" },
    { title: "Relationship Goals", readTime: "15 min read" },
    { title: "Make Your Bed: Little Things Matter", readTime: "20 min read" },
    { title: "Atomic Habits: Build Better Habits", readTime: "16 min read" },
    { title: "The 48 Laws of Power", readTime: "17 min read" },
    { title: "12 Rules For Life", readTime: "18 min read" },
    { title: "Money Master The Game", readTime: "14 min read" },
    { title: "How to Win Friends and Influence People", readTime: "13 min read" },
    { title: "Sapiens: A Brief History of Humankind", readTime: "15 min read" },
    { title: "Girl, Stop Apologizing", readTime: "15 min read" },
    { title: "The Art of War: Ancient Wisdom for Modern Success", readTime: "17 min read" },
    { title: "Declutter Your Mind", readTime: "15 min read" },
    { title: "The Alchemist", readTime: "15 min read" },
    { title: "The Miracle Morning", readTime: "14 min read" },
    { title: "The 4-Hour Workweek", readTime: "13 min read" },
    { title: "The 5 Second Rule", readTime: "15 min read" },
    { title: "The Intelligent Investor", readTime: "18 min read" },
    { title: "Never Chase Men Again", readTime: "20 min read" },
    { title: "Ikigai: The Japanese Secret to a Long Life", readTime: "14 min read" },
    { title: "The Four Agreements: Practical Guide to Freedom", readTime: "15 min read" },
    { title: "The Law of Attraction", readTime: "15 min read" },
    { title: "Never Split the Difference", readTime: "15 min read" },
    { title: "Mindset: The New Psychology of Success", readTime: "14 min read" },
    { title: "Getting Things Done", readTime: "15 min read" },
    { title: "No Excuses: Master Self-Discipline", readTime: "15 min read" },
];

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function generateExcerpt(title: string): string {
    const excerpts: Record<string, string> = {
        "The 5 AM Club": "Discover how waking up at 5 AM can transform your productivity, health, and success. Learn the morning routines that elite performers use to dominate their days.",
        "Rich Dad Poor Dad": "Master the wealth-building principles that separate the rich from the poor. Learn about assets, liabilities, and how to make your money work for you.",
        "No Excuses: The Power of Self-Discipline": "Unlock your full potential through the power of self-discipline. Learn practical strategies to eliminate excuses and achieve extraordinary results.",
        "The Power of Now": "Transform your life by embracing the present moment. Discover how to break free from past regrets and future anxieties to find peace and fulfillment.",
        "The 10X Rule": "Learn why massive action is the key to extraordinary success. Discover how setting goals 10 times bigger than you think leads to achieving what others consider impossible.",
        "Unlimited Memory": "Master proven techniques to remember anything and boost your mental performance. Learn memory strategies used by world champions.",
        "The 4-Hour Body": "Discover unconventional methods to optimize your body, from rapid fat loss to superhuman sleep. Learn the minimum effective dose for maximum results.",
        "Limitless: Upgrade Your Brain": "Unlock your brain's full potential with proven techniques to learn faster, think smarter, and achieve more. Transform your mental limitations into superpowers.",
        "Think and Grow Rich": "Master the timeless principles of wealth creation and success. Learn the mindset and habits that made millionaires out of ordinary people.",
        "Quiet: The Power of Introverts": "Discover the hidden strengths of introverts and how to thrive in a world that can't stop talking. Learn to harness the power of quiet reflection.",
        "Not Nice: Stop People Pleasing": "Break free from the trap of people-pleasing and learn to set healthy boundaries. Discover how being less nice can lead to more authentic relationships.",
        "The 80/20 Principle": "Learn how 20% of your efforts produce 80% of your results. Master the art of focusing on what truly matters for maximum impact.",
        "The 5 Love Languages": "Discover the secret to lasting love by understanding how people give and receive affection differently. Transform your relationships through better communication.",
        "The Power of Habit: Transform Your Life": "Master the science of habit formation to break bad habits and build good ones. Learn how small changes can lead to remarkable transformations.",
        "Lean In: Women, Work, and the Will to Lead": "Empower yourself with practical advice for women seeking leadership and success in their careers. Learn to overcome internal and external barriers.",
        "Elon Musk: Lessons from a Visionary": "Learn the mindset and strategies that made Elon Musk one of the most successful entrepreneurs of our time. Discover how to think bigger and achieve the impossible.",
        "Thinking, Fast and Slow": "Understand the two systems that drive the way we think and make decisions. Master cognitive biases to improve your judgment and choices.",
        "Steal Like an Artist": "Unlock your creative potential by learning from the masters. Discover how all great artists use inspiration ethically to create original work.",
        "The Four Agreements": "Transform your life with four simple yet powerful agreements. Learn the ancient Toltec wisdom that can lead to personal freedom and happiness.",
        "Don't Overthink It": "Break free from the cycle of analysis paralysis and learn to make decisions with confidence. Discover practical techniques to quiet your racing mind.",
        "Relationship Goals": "Build the relationship of your dreams with practical advice on love, communication, and commitment. Learn what it takes to create lasting partnership.",
        "Make Your Bed: Little Things Matter": "Discover how small daily disciplines lead to big achievements. Learn the military-inspired principles that can transform your life one task at a time.",
        "Atomic Habits: Build Better Habits": "Master the compound effect of tiny changes to achieve remarkable results. Learn the four laws of behavior change that make good habits inevitable.",
        "The 48 Laws of Power": "Master the timeless strategies of power and influence. Learn from historical examples how to navigate social dynamics and achieve your goals.",
        "12 Rules For Life": "Find meaning and order in the chaos of modern existence. Discover practical rules for living that blend ancient wisdom with modern psychology.",
        "Money Master The Game": "Learn the strategies of the world's greatest investors to achieve financial freedom. Discover actionable steps to secure your financial future.",
        "How to Win Friends and Influence People": "Master the timeless art of building genuine relationships and influencing others positively. Learn the principles that have helped millions succeed.",
        "Sapiens: A Brief History of Humankind": "Explore the fascinating journey of humanity from ancient hunter-gatherers to the rulers of the planet. Understand what makes us uniquely human.",
        "Girl, Stop Apologizing": "Embrace your dreams unapologetically and silence your inner critic. Learn to pursue your goals with confidence and without seeking permission.",
        "The Art of War: Ancient Wisdom for Modern Success": "Apply ancient military strategy to modern business and life. Learn the timeless principles of strategy, leadership, and winning.",
        "Declutter Your Mind": "Clear the mental clutter that's holding you back from peace and productivity. Learn practical techniques for managing stress and finding focus.",
        "The Alchemist": "Follow your personal legend and discover the transformative power of pursuing your dreams. Learn the universal wisdom hidden in this beloved tale.",
        "The Miracle Morning": "Transform your life before 8 AM with a powerful morning routine. Learn the six practices that can set you up for success every single day.",
        "The 4-Hour Workweek": "Escape the 9-5, live anywhere, and join the new rich. Learn how to automate your income and design your ideal lifestyle.",
        "The 5 Second Rule": "Use the power of counting backwards to overcome hesitation and take action. Learn the simple technique that can change any area of your life.",
        "The Intelligent Investor": "Master the principles of value investing that have created generations of wealth. Learn how to invest wisely and avoid costly mistakes.",
        "Never Chase Men Again": "Transform your dating life by understanding your true value. Learn to attract the right partner by becoming the best version of yourself.",
        "Ikigai: The Japanese Secret to a Long Life": "Discover your reason for being and unlock the secret to a long, fulfilling life. Learn the Japanese philosophy that combines passion, mission, and purpose.",
        "The Four Agreements: Practical Guide to Freedom": "Apply the ancient Toltec wisdom in your daily life for genuine personal freedom. Master the agreements that can transform your relationships and self-image.",
        "The Law of Attraction": "Master the art of manifesting your desires into reality. Learn how your thoughts and energy can attract abundance and success into your life.",
        "Never Split the Difference": "Master the art of negotiation from a former FBI hostage negotiator. Learn techniques to get what you want in any situation.",
        "Mindset: The New Psychology of Success": "Discover how a simple belief about yourself can determine your success. Learn to develop a growth mindset that unlocks your potential.",
        "Getting Things Done": "Master stress-free productivity with the world's most popular organizational system. Learn to capture, organize, and complete tasks efficiently.",
        "No Excuses: Master Self-Discipline": "Develop iron-clad self-discipline to achieve any goal. Learn why discipline is the ultimate key to success and how to cultivate it.",
    };
    return excerpts[title] || `Discover the key insights and transformative lessons from ${title}. Learn practical strategies to apply in your daily life for lasting change.`;
}

function generateContent(title: string): string {
    const contents: Record<string, string> = {
        "The 5 AM Club": `
# The 5 AM Club: Own Your Morning, Elevate Your Life

Robin Sharma's revolutionary guide to maximizing productivity and personal development through the power of early rising has transformed millions of lives worldwide. In this comprehensive summary, we explore the key principles that make the 5 AM Club more than just a morning routine—it's a complete life transformation system.

## The Origin Story

The book follows an entrepreneur and an artist who meet a quirky billionaire who introduces them to the concept of the 5 AM Club. Through their mentorship, they discover that the world's most successful people share one common habit: they rise with the sun.

## Why 5 AM?

The hour between 5 and 6 AM is what Sharma calls the "Victory Hour." Here's why it's magical:

- **Zero distractions** - The world is asleep, and you have complete focus
- **Fresh willpower** - Your mental energy is at its peak after rest
- **Quiet environment** - No emails, calls, or interruptions
- **Compound effect** - One hour daily = 365 hours yearly of self-improvement

## The 20/20/20 Formula

The heart of the 5 AM Club is the 20/20/20 formula, dividing your Victory Hour into three power segments:

### First 20 Minutes: Move

- Intense exercise to spike your metabolism
- Releases BDNF (brain-derived neurotrophic factor)
- Clears cortisol and reduces stress
- Generates endorphins for positive mood

### Second 20 Minutes: Reflect

- Meditation and mindfulness practice
- Journaling your thoughts and gratitude
- Visualization of your goals
- Prayer or spiritual connection

### Third 20 Minutes: Grow

- Reading books and learning
- Listening to podcasts or audiobooks
- Studying your craft
- Skill development and education

## The Four Interior Empires

Sharma introduces the concept of four interior empires that must be developed:

1. **Mindset** - Your thoughts create your reality
2. **Heartset** - Emotional mastery and healing
3. **Healthset** - Physical vitality and energy
4. **Soulset** - Spiritual connection and purpose

## The Twin Cycles of Elite Performance

Success requires balancing two cycles:

### The High Excellence Cycle (HEC)
- 5 deep work sessions daily
- Focused concentration without distraction
- Pushing beyond comfort zones
- Deliberate practice

### The Deep Recovery Cycle (DRC)
- Quality sleep (7-8 hours)
- Nature exposure
- Massage and physical recovery
- Digital detoxification

## The 10 Tactics of Lifelong Genius

1. **The Tight Bubble of Total Focus** - Create distraction-free environments
2. **The 90/90/1 Rule** - First 90 minutes on your #1 priority
3. **The 60/10 Method** - 60 minutes work, 10 minutes rest
4. **The Daily 5 Concept** - Five small daily targets
5. **The Second Wind Workout** - Late afternoon exercise boost
6. **The 2 Massage Protocol** - Weekly recovery massages
7. **Traffic University** - Learn during commutes
8. **The Dream Team** - Surround yourself with excellence
9. **The Weekly Design System** - Sunday planning sessions
10. **The 60-Minute Student** - Daily learning commitment

## Installing the Habit

The book teaches that habit installation requires approximately 66 days and goes through three phases:

### Phase 1: Destruction (Days 1-22)
- Old patterns resist change
- Highest willpower requirement
- Maximum discomfort

### Phase 2: Installation (Days 23-44)
- New neural pathways forming
- Decreasing resistance
- Emerging automaticity

### Phase 3: Integration (Days 45-66)
- Habit becomes automatic
- Part of identity
- Minimal effort required

## Key Quotes to Remember

> "Take excellent care of the front end of your day, and the rest of your day will take care of itself."

> "All change is hard at first, messy in the middle, and gorgeous at the end."

> "Your excuses are nothing more than the lies your fears have sold you."

## Practical Implementation Tips

1. **Start the night before** - Prepare clothes, breakfast, and materials
2. **Move your alarm** - Place it across the room
3. **Find your "Why"** - Connect to deeper purpose
4. **Join a community** - Accountability accelerates results
5. **Track your progress** - What gets measured gets improved

## The Compound Effect of Mornings

Over time, the 5 AM routine creates extraordinary results:

- **1 year**: 365 extra hours of growth
- **5 years**: Deep expertise development
- **10 years**: Complete life transformation
- **Lifetime**: Legacy-level achievement

## Conclusion

The 5 AM Club isn't just about waking up early—it's about taking ownership of your life. By winning the battle with the snooze button, you win the day. By winning your days, you win your weeks. By winning your weeks, you win your life.

Start tomorrow. Rise at 5 AM. Join the club of world-changers who understand that how you start your day determines how you live your life.

---

*The morning hour has gold in its mouth. — Benjamin Franklin*
`,

        "Rich Dad Poor Dad": `
# Rich Dad Poor Dad: What the Rich Teach Their Kids About Money

Robert Kiyosaki's groundbreaking book has transformed how millions think about money, wealth, and financial education. This summary captures the essential lessons that separate the financially free from those trapped in the rat race.

## The Two Dads

Kiyosaki grew up with two father figures:

**Poor Dad** (biological father):
- Highly educated with a Ph.D.
- Believed in job security and steady paychecks
- Said "I can't afford it"
- Thought money was the root of evil

**Rich Dad** (best friend's father):
- Dropped out of school in 8th grade
- Built multiple businesses and investments
- Said "How can I afford it?"
- Thought lack of money was the root of evil

## Lesson 1: The Rich Don't Work for Money

The fundamental difference between rich and poor:

**The Poor**: Work for money → Spend money → Work harder for more money

**The Rich**: Make money work for them → Money makes more money → Freedom

### The Rat Race Trap
- Fear and greed drive most financial decisions
- More money often means more spending
- Job security is an illusion
- Trading time for money has limits

### Breaking Free
- Learn to recognize opportunities
- Use emotions wisely, don't let them control you
- Acquire assets that generate income
- Build systems that work without you

## Lesson 2: Why Teach Financial Literacy?

Schools teach how to work for money, not how to make money work for you.

### The Critical Difference: Assets vs. Liabilities

**Assets put money IN your pocket:**
- Real estate that generates rental income
- Stocks that pay dividends
- Businesses that run without you
- Intellectual property (royalties)
- Bonds and other paper assets

**Liabilities take money OUT of your pocket:**
- Your home (if it's not generating income)
- Cars
- Consumer debt
- Expensive "toys"

### The Wealth Equation

**Poor/Middle Class**: Income → Expenses (repeat)
**Rich**: Income → Assets → More Income → More Assets

## Lesson 3: Mind Your Own Business

### The Difference Between Profession and Business
- Your profession is how you earn income
- Your business is your column of assets

### Focus on Your Asset Column
- Keep your day job while building assets
- Start part-time businesses
- Invest consistently
- Acquire real estate strategically

## Lesson 4: The History of Taxes and Corporations

The rich use legal strategies to minimize taxes:

### How Corporations Protect Wealth
1. **Earn** (corporate income)
2. **Spend** (business expenses)
3. **Pay taxes** (on what's left)

### How Employees Pay
1. **Earn** (salary)
2. **Pay taxes** (withheld immediately)
3. **Spend** (what's left)

### The Power of Corporation
- Legal protection of assets
- Tax advantages
- Separation of personal and business
- Wealth-building vehicle

## Lesson 5: The Rich Invent Money

Financial intelligence creates opportunities:

### The Components of Financial IQ
1. **Accounting** - Understanding numbers and cash flow
2. **Investing** - Making money make money
3. **Understanding markets** - Supply and demand
4. **Law** - Tax advantages and protection

### Creating Money vs. Waiting for It
- See opportunities others miss
- Raise capital for deals
- Organize smart people together
- Take calculated risks

## Lesson 6: Work to Learn, Not for Money

### Skills That Pay
- Sales and marketing
- Communication
- Leadership
- Financial literacy
- Negotiation

### The Three Management Skills
1. Management of cash flow
2. Management of systems
3. Management of people

## Overcoming Obstacles

Five main reasons people don't achieve financial success:

1. **Fear** - Fear of losing money
2. **Cynicism** - Doubt and negative thinking
3. **Laziness** - Staying in comfort zone
4. **Bad habits** - Paying others first
5. **Arrogance** - Ego blocking learning

### Conquering Each Obstacle

**For Fear**: Everyone loses money. The difference is how you handle loss.

**For Cynicism**: Analyze criticism vs. opportunity. Most critics never try.

**For Laziness**: Use "greed" wisely—what could life look like?

**For Bad Habits**: Pay yourself first, then find ways to pay bills.

**For Arrogance**: What you don't know is what hurts you. Keep learning.

## Getting Started: Ten Steps

1. Find a reason greater than reality (your "why")
2. Choose daily to be rich (it's a choice)
3. Choose friends carefully (mindset matters)
4. Master a formula, then learn a new one
5. Pay yourself first (discipline)
6. Pay your advisors well (expertise)
7. Be an "Indian giver" (ROI focus)
8. Use assets to buy luxuries
9. Find heroes to model
10. Teach and you shall receive

## The Cash Flow Quadrant

Kiyosaki introduces four ways people earn income:

- **E** - Employee (trades time for money)
- **S** - Self-employed (owns a job)
- **B** - Business owner (owns a system)
- **I** - Investor (money works for them)

The goal: Move from left side (E/S) to right side (B/I)

## Key Takeaways

> "The poor and the middle class work for money. The rich have money work for them."

> "In school we learn that mistakes are bad. In the real world, mistakes are how we learn."

> "The single most powerful asset we all have is our mind."

## Conclusion

Rich Dad Poor Dad isn't about getting rich quick—it's about getting rich smart. Financial education is the foundation of wealth. By understanding the difference between assets and liabilities, and by focusing on building your asset column, you can escape the rat race and achieve true financial freedom.

---

*The richest people in the world look for and build networks. Everyone else looks for work.*
`,
    };

    // Generate generic content for books not specifically defined
    if (!contents[title]) {
        return `
# ${title}: Key Insights and Life-Changing Lessons

## Introduction

"${title}" is a transformative book that has influenced millions of readers worldwide. In this comprehensive summary, we explore the core concepts, practical strategies, and life-changing insights that make this book a must-read for anyone seeking personal and professional growth.

## Core Philosophy

At the heart of this book lies a simple yet profound truth: lasting change comes from understanding fundamental principles and applying them consistently. The author presents a framework that has been tested and proven by countless successful individuals.

### The Foundation

Every great achievement begins with a solid understanding of the basics. This book emphasizes:

- **Clarity of purpose** - Knowing exactly what you want to achieve
- **Consistent action** - Taking daily steps toward your goals
- **Continuous learning** - Never stopping your personal development
- **Courage to change** - Being willing to step outside your comfort zone

## Key Principle 1: Mindset Matters Most

Your beliefs shape your reality. What you think about consistently expands into every area of your life.

### Developing the Right Mindset

1. **Question limiting beliefs** - Challenge thoughts that hold you back
2. **Embrace growth** - See challenges as opportunities to learn
3. **Visualize success** - Create mental images of your desired outcomes
4. **Practice gratitude** - Focus on what you have, not what you lack

### The Power of Perspective

How you interpret events determines how they affect you. The same situation can be a disaster or an opportunity depending on your perspective. This book teaches you to:

- Reframe negative experiences
- Find lessons in failures
- See obstacles as teachers
- Maintain optimism during challenges

## Key Principle 2: Action Trumps Planning

While planning has its place, action is where the magic happens. Many people get stuck in analysis paralysis, planning indefinitely without ever taking the first step.

### The Action Formula

1. **Start before you're ready** - Perfection is the enemy of progress
2. **Learn by doing** - Theory only takes you so far
3. **Fail forward** - Each failure brings you closer to success
4. **Iterate rapidly** - Small improvements compound over time

### Overcoming Procrastination

The book provides practical strategies for beating procrastination:

- Break large tasks into small steps
- Use the two-minute rule
- Create accountability systems
- Design your environment for success

## Key Principle 3: Relationships Are Everything

No one succeeds alone. This book emphasizes the crucial role of relationships in achieving success.

### Building Your Network

- **Give first** - Be generous without expectation
- **Be genuine** - Authenticity attracts the right people
- **Add value** - Focus on how you can help others
- **Stay connected** - Nurture relationships consistently

### The Power of Mentorship

Finding mentors accelerates your growth exponentially. The book teaches:

- How to identify potential mentors
- How to approach them respectfully
- How to maximize the relationship
- How to become a mentor yourself

## Key Principle 4: Systems Beat Goals

While goals provide direction, systems provide results. A goal is what you want to achieve; a system is what you do daily.

### Creating Effective Systems

1. **Identify key behaviors** - What actions lead to results?
2. **Build routines** - Automate success through habit
3. **Track progress** - What gets measured gets improved
4. **Adjust continuously** - Refine based on feedback

### The Compound Effect

Small, consistent actions compound into remarkable results over time. This principle shows how:

- 1% daily improvement leads to 37x improvement in a year
- Consistency beats intensity
- Patience is essential
- Small wins build momentum

## Key Principle 5: Self-Care Is Not Selfish

You cannot pour from an empty cup. Taking care of yourself is essential for sustainable success.

### The Pillars of Self-Care

- **Physical health** - Exercise, nutrition, sleep
- **Mental health** - Stress management, meditation
- **Emotional health** - Processing feelings, setting boundaries
- **Spiritual health** - Connection to purpose and meaning

### Energy Management

Success requires energy. The book teaches:

- How to optimize your energy levels
- When to push and when to rest
- How to recover from burnout
- How to sustain peak performance

## Practical Applications

### Morning Routine

Start your day with intention:
1. Wake up early
2. Practice gratitude
3. Exercise
4. Plan your day
5. Focus on your most important task

### Evening Routine

End your day with reflection:
1. Review accomplishments
2. Plan for tomorrow
3. Disconnect from screens
4. Practice relaxation
5. Get quality sleep

### Weekly Review

Every week, assess:
- What worked well?
- What could improve?
- What will you focus on next week?
- Are you aligned with your goals?

## Common Mistakes to Avoid

1. **Trying to change everything at once** - Focus on one area at a time
2. **Comparing yourself to others** - Your journey is unique
3. **Giving up too soon** - Success takes time
4. **Neglecting fundamentals** - Basics matter most
5. **Going it alone** - Seek help and support

## Implementation Strategy

### Week 1-2: Foundation
- Read and understand the core concepts
- Identify your primary area for improvement
- Set clear, measurable goals

### Week 3-4: Experimentation
- Try different strategies
- Note what works for you
- Adjust based on results

### Month 2-3: Refinement
- Double down on what works
- Eliminate what doesn't
- Build sustainable habits

### Month 4+: Expansion
- Apply principles to new areas
- Share what you've learned
- Continue growing and improving

## Key Quotes to Remember

> "Success is not final, failure is not fatal: it is the courage to continue that counts."

> "The difference between ordinary and extraordinary is that little extra."

> "Your life does not get better by chance, it gets better by change."

> "The only person you are destined to become is the person you decide to be."

## Conclusion

"${title}" provides a roadmap for personal transformation. The principles are simple but not easy. They require consistent application and patience. However, for those willing to put in the work, the rewards are transformational.

Start with one principle. Master it. Then move to the next. Over time, these compounding improvements will transform every area of your life.

Remember: The best time to start was yesterday. The second best time is now.

---

*The journey of a thousand miles begins with a single step. Take yours today.*
`;
    }

    return contents[title];
}

async function insertBlogs() {
    try {
        // Get author ID
        const [users] = await pool.query('SELECT id, name FROM users LIMIT 1') as any;
        if (users.length === 0) {
            console.error('No users found');
            process.exit(1);
        }
        const authorId = users[0].id;
        console.log('Using author: ' + users[0].name + ' (ID: ' + authorId + ')');

        const category = 'Self Development';
        const image = '/images/placeholder.jpg';
        const status = 'published';

        // Calculate dates - 2 posts per day, going back from today
        const today = new Date();
        let postsCreated = 0;
        let postsUpdated = 0;

        for (let i = 0; i < topics.length; i++) {
            const topic = topics[i];
            const dayOffset = Math.floor(i / 2); // 2 posts per day
            const postDate = new Date(today);
            postDate.setDate(postDate.getDate() - dayOffset - 1); // Start from yesterday
            const dateStr = postDate.toISOString().split('T')[0];

            const slug = generateSlug(topic.title);
            const excerpt = generateExcerpt(topic.title);
            const markdownContent = generateContent(topic.title);
            const htmlContent = await marked(markdownContent);

            // Check if exists
            const [existing] = await pool.query('SELECT id FROM posts WHERE slug = ?', [slug]) as any;

            if (existing.length > 0) {
                await pool.query(
                    'UPDATE posts SET title = ?, excerpt = ?, content = ?, category = ?, readTime = ?, status = ?, date = ? WHERE slug = ?',
                    [topic.title, excerpt, htmlContent, category, topic.readTime, status, dateStr, slug]
                );
                postsUpdated++;
                console.log('Updated: ' + topic.title + ' (' + dateStr + ')');
            } else {
                await pool.query(
                    'INSERT INTO posts (slug, title, excerpt, date, readTime, category, content, views, image, author_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)',
                    [slug, topic.title, excerpt, dateStr, topic.readTime, category, htmlContent, image, authorId, status]
                );
                postsCreated++;
                console.log('Created: ' + topic.title + ' (' + dateStr + ')');
            }
        }

        console.log('\n=== Summary ===');
        console.log('Posts created: ' + postsCreated);
        console.log('Posts updated: ' + postsUpdated);
        console.log('Total processed: ' + topics.length);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

insertBlogs();
