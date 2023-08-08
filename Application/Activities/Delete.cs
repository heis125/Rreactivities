using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {
        public class Comand : IRequest 
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Comand>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public DataContext Context { get; }

            public async Task<Unit> Handle(Comand request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Id);

                _context.Remove(activity);

                await _context.SaveChangesAsync();

                return Unit.Value;
            }
        }
    }
}
