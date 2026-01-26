import { createFileRoute, Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Download, ExternalLink, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const Route = createFileRoute('/vinland')({
  component: VinlandStreamingProposal,
});

function VinlandStreamingProposal() {
  return (
    <div className='min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 pt-16'>
      <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='mb-8'
        >
          <Button
            asChild
            variant='ghost'
            className='mb-6 text-amber-400 hover:text-amber-300'
          >
            <Link to='/' className='flex items-center gap-2'>
              <ArrowLeft size={18} />
              Back to Home
            </Link>
          </Button>
          <div className='flex items-center gap-3 mb-4'>
            <Film className='w-8 h-8 text-amber-400' />
            <h1 className='text-4xl md:text-5xl font-serif font-bold text-white'>
              VINLAND
            </h1>
          </div>
          <p className='text-xl text-gray-400 italic'>
            Game of Thrones Meets Last of the Mohicans
          </p>
          <p className='text-lg text-gray-300 mt-2'>
            A Multi-Season Series for Streaming Television
          </p>
          <div className='mt-6'>
            <Button
              asChild
              size='lg'
              className='bg-amber-500 hover:bg-amber-600 text-white'
            >
              <a
                href='/ACFrOgBwOILsbul9lM5-gRnP6dtjiocqrrVKzs9nnom8XlU71UFii7xxai7p5DwQhCwK_9zYcNOE6GxAxpa_n57Ppw5SMqbtK7Pea5DnG6MgO6nVaKEgFWMB8dTxWaChfoHTVPNOgU8DVJ5PM9z8q2LhusPCcdZuCdnb814Pwg==.pdf'
                download='Vinland-Streaming-Proposal.pdf'
                className='inline-flex items-center gap-2'
              >
                <Download size={20} />
                Download Streaming Proposal PDF
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='space-y-8'
        >
          {/* Introduction */}
          <Card className='bg-slate-800/50 border-slate-700'>
            <CardHeader>
              <CardTitle className='text-2xl font-serif text-white'>
                Model Query for Streaming Proposal
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p className='text-lg text-gray-300 leading-relaxed'>
                Set in 11th century Greenland and North America,{' '}
                <a
                  href='https://www.amazon.co.uk/King-Vinlands-Saga-Stuart-Mirsky/dp/0738801520'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-amber-400 hover:text-amber-300 underline inline-flex items-center gap-1'
                >
                  The King of Vinland's Saga
                  <ExternalLink size={14} />
                </a>{' '}
                follows the trials and exploits of a fictional grandson of Leif
                Eiriksson seeking to regain his heritage. The novel, told in the
                saga style, easily lends itself to cinematic presentation.
              </p>
            </CardContent>
          </Card>

          {/* Project Description */}
          <Card className='bg-slate-800/50 border-slate-700'>
            <CardHeader>
              <CardTitle className='text-2xl font-serif text-white'>
                Description of Proposed Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-lg text-gray-300 leading-relaxed'>
                The story commences in the medieval Norse colony in Greenland
                (a rather timely locale, because it's so politically fraught
                these days) and rapidly shifts to North America as a group of
                Norse Greenlanders attempt to establish a foothold on North
                America's shores.
              </p>
            </CardContent>
          </Card>

          {/* Pilot Synopsis */}
          <Card className='bg-slate-800/50 border-slate-700'>
            <CardHeader>
              <CardTitle className='text-2xl font-serif text-white'>
                Synopsis for Pilot "Inheritance" (Episodes 1 & 2)
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p className='text-lg text-gray-300 leading-relaxed'>
                Sigtrygg, an outcast of mixed Norse/Inuit (Eskimo) blood,
                returns to his family's Greenland home after years of exile, and
                seeks the return of his father's abandoned Greenland farmstead
                at the urging of his half-cousin, Thjodhild Gunnarsdottir. But
                when his uncles deny him this, he consents to take the rights to
                his grandfather's long-lost land claim in the distant country of
                Vinland across the sea instead, much to the dismay of his
                Thjodhild.
              </p>
              <p className='text-lg text-gray-300 leading-relaxed'>
                Seeking to raise the needed crew for the journey, he falls in
                with an old man of suspicious background and some local ruffians
                in another Ketilsfjord who will eventually form the nucleus of
                that crew. But, on returning to his kinsmen, he discovers his
                father's half-brothers have had second thoughts about their
                "deal" and are seeking to change its terms.
              </p>
              <p className='text-lg text-gray-300 leading-relaxed'>
                Now wedded to the idea of re-claiming Vinland, Sigtrygg refuses
                compromise and, with help from a still reluctant Thjodhild and
                another of his cousins, Girstein Eiriksson, he absconds with the
                promised ship, only to be pursued in a desperate and bloody race
                down the length of the fjord to open sea – a race in which he
                will inadvertently harm another of his kinsmen and set in motion
                a bitter blood feud that will follow him all the way to Vinland.
              </p>
            </CardContent>
          </Card>

          {/* Story Outline */}
          <Card className='bg-slate-800/50 border-slate-700'>
            <CardHeader>
              <CardTitle className='text-2xl font-serif text-white'>
                Story Outline for the Overall Series
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <p className='text-lg text-gray-300 leading-relaxed'>
                Consisting of several seasons, with multiple episodes, Vinland
                opens in the medieval Norse colony of Greenland as Sigtrygg
                Thorgilsson (half-Inuit grandson of Leif Eiriksson) returns from
                lonely exile to reclaim his birthright. Thwarted and betrayed by
                his own, he must flee that country's ice-clad coastal waters,
                just ahead of his greedy kinsmen who would keep his inheritance
                from him, to seek his own in the distant and unexplored lands
                last glimpsed by his grandfather more than 40 years before.
                Following the events in Episodes 1 and 2 above, Sigtrygg and his
                hastily gathered crew of somewhat unsavory men, makes his way to
                Vinland where they run head on into reality, that the new
                country they'd hoped to settle is already occupied and the people
                there are anything but enthusiastic about their arrival.
              </p>

              <Separator className='bg-slate-700' />

              <div>
                <h3 className='text-xl font-serif text-amber-400 mb-3'>
                  Episodes 3-8
                </h3>
                <p className='text-lg text-gray-300 leading-relaxed'>
                  Completing the hazardous crossing with his hastily assembled
                  crew proves the least of their trials when, on arrival in the
                  new land, they learn it's not just there for the taking. Taken
                  captive by a native tribe, Sigtrygg must find the means to
                  convince these people of their value to them. When the chief's
                  own daughter is taken by a stronger tribe, Sigtrygg convinces
                  the chief to rely on him and his men to return her to her
                  people. It's a risky gamble but, despite a series of bloody
                  confrontations, they pull it off and Sigtrygg finds love with
                  the native chief's daughter. Yet, even as the gamble they'd
                  undertaken pays off, with Sigtrygg and his men accepted into the
                  tribe as equals, their situation will only worsen again when his
                  angry kinsmen arrive in his wake, still smarting over the
                  damage he'd inflicted on them when he fled Greenland.
                </p>
              </div>

              <Separator className='bg-slate-700' />

              <div>
                <h3 className='text-xl font-serif text-amber-400 mb-3'>
                  Episodes 9-14
                </h3>
                <p className='text-lg text-gray-300 leading-relaxed'>
                  With the appearance of his aggrieved kinsmen, intent on
                  avenging the wrong they hold him accountable for, only the
                  shrewd counsel of a "retired" viking in his rag-tag crew, and
                  the passion of Thjodhild, the woman he left behind in his
                  initial flight from Greenland who has sailed with the others to
                  find him, offer a way out—if he can bring himself to take it
                  despite the ties he has now forged with the native tribe he
                  aided—while storm clouds gather ominously in the west and a
                  previously defeated foe prepares to seek his own revenge.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Market Context */}
          <Card className='bg-slate-800/50 border-slate-700'>
            <CardHeader>
              <CardTitle className='text-2xl font-serif text-white'>
                Market Context
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p className='text-lg text-gray-300 leading-relaxed'>
                This story will find its audience, as many historical epics in
                this vein have before it (though none have yet focused on the
                Norse encounter with native Americans) as it blends the narrative
                power and epic resonances of the Norse saga tradition with the
                action and adventure genre set in historically colorful eras.
              </p>
              <p className='text-lg text-gray-300 leading-relaxed'>
                Some successful streaming shows of this type, that have tapped
                into the same audience demographic, include:{' '}
                <em className='text-amber-400'>Shogun</em>,{' '}
                <em className='text-amber-400'>Vikings</em>,{' '}
                <em className='text-amber-400'>The Last Kingdom</em> (and more
                fantasy-oriented fare with a medieval flavor like{' '}
                <em className='text-amber-400'>Lord of the Rings</em> and{' '}
                <em className='text-amber-400'>Game of Thrones</em>). Other
                recent entries to the field include the historical epic based in
                19th century Hawaii, <em className='text-amber-400'>Chief of War</em>{' '}
                (starring Jason Momoa) and the just-released BBC series{' '}
                <em className='text-amber-400'>King and Conqueror</em>.
              </p>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className='bg-gradient-to-r from-amber-900/20 to-amber-800/20 border-amber-500/50'>
            <CardContent className='pt-6'>
              <p className='text-lg text-gray-200 leading-relaxed text-center'>
                I hope you'll see the potential here that I do and share my
                enthusiasm for the development of a streaming television series
                based on this story.
              </p>
              <div className='mt-6 flex justify-center gap-4'>
                <Button
                  asChild
                  className='bg-amber-500 hover:bg-amber-600 text-white'
                >
                  <Link
                    to='/'
                    search={{ bookId: 'king-of-vinland' }}
                    className='flex items-center gap-2'
                  >
                    <BookOpen size={18} />
                    Read the Book
                  </Link>
                </Button>
                <Button
                  asChild
                  variant='outline'
                  className='border-amber-500/50 text-amber-400 hover:bg-amber-500/10'
                >
                  <a
                    href='/ACFrOgBwOILsbul9lM5-gRnP6dtjiocqrrVKzs9nnom8XlU71UFii7xxai7p5DwQhCwK_9zYcNOE6GxAxpa_n57Ppw5SMqbtK7Pea5DnG6MgO6nVaKEgFWMB8dTxWaChfoHTVPNOgU8DVJ5PM9z8q2LhusPCcdZuCdnb814Pwg==.pdf'
                    download='Vinland-Streaming-Proposal.pdf'
                    className='flex items-center gap-2'
                  >
                    <Download size={18} />
                    Download PDF
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

