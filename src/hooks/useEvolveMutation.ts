import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EvolveRequest, JobStatus, Evolution, Artwork } from '@/types';

// Mock API functions
const evolveArtwork = async (request: EvolveRequest): Promise<{ jobId: string }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return {
    jobId: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  };
};

const checkJobStatus = async (jobId: string): Promise<JobStatus> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const evolution: Evolution = {
    id: `evo-${Date.now()}`,
    step: Math.floor(Math.random() * 10) + 1,
    prompt: 'Generated evolution',
    imageUrl: `/api/placeholder/512/512?text=New${Date.now()}`,
    createdAt: new Date().toISOString(),
    params: {
      steps: 50,
      guidanceScale: 7.5,
      strength: 0.8,
      seed: Math.floor(Math.random() * 1000000)
    }
  };
  
  return {
    id: jobId,
    status: 'done',
    progress: 100,
    resultUrl: evolution.imageUrl
  };
};

export const useEvolveMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (request: EvolveRequest) => {
      // Start the evolution job
      const { jobId } = await evolveArtwork(request);
      
      // Poll for completion (in real app, this would be handled differently)
      const jobStatus = await checkJobStatus(jobId);
      
      if (jobStatus.status === 'done' && jobStatus.resultUrl) {
        // Create new evolution
        const newEvolution: Evolution = {
          id: `evo-${Date.now()}`,
          step: Date.now() % 100,
          prompt: request.prompt,
          imageUrl: jobStatus.resultUrl,
          createdAt: new Date().toISOString(),
          params: request.params
        };
        
        return { evolution: newEvolution, jobId };
      }
      
      throw new Error('Evolution failed');
    },
    onMutate: async (request: EvolveRequest) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['artwork', request.artworkId] });
      
      // Snapshot the previous value
      const previousArtwork = queryClient.getQueryData<Artwork>(['artwork', request.artworkId]);
      
      // Optimistically update with pending evolution
      if (previousArtwork) {
        const optimisticEvolution: Evolution = {
          id: `pending-${Date.now()}`,
          step: previousArtwork.evolutions.length + 1,
          prompt: request.prompt,
          imageUrl: '/api/placeholder/512/512?text=Processing...',
          createdAt: new Date().toISOString(),
          params: request.params
        };
        
        const updatedArtwork: Artwork = {
          ...previousArtwork,
          evolutions: [...previousArtwork.evolutions, optimisticEvolution],
          updatedAt: new Date().toISOString()
        };
        
        queryClient.setQueryData(['artwork', request.artworkId], updatedArtwork);
      }
      
      return { previousArtwork };
    },
    onError: (err, request, context) => {
      // Rollback optimistic update
      if (context?.previousArtwork) {
        queryClient.setQueryData(['artwork', request.artworkId], context.previousArtwork);
      }
    },
    onSuccess: (data, request) => {
      // Update with real evolution data
      const previousArtwork = queryClient.getQueryData<Artwork>(['artwork', request.artworkId]);
      
      if (previousArtwork && data.evolution) {
        const updatedArtwork: Artwork = {
          ...previousArtwork,
          evolutions: [
            ...previousArtwork.evolutions.filter(evo => !evo.id.startsWith('pending-')),
            data.evolution
          ],
          updatedAt: new Date().toISOString()
        };
        
        queryClient.setQueryData(['artwork', request.artworkId], updatedArtwork);
      }
    },
  });
};